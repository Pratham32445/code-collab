import { useEffect, useRef, useState } from "react";
import { IncomingChange, OpenedFileContent, OpenedFileExtension, OpenedFilePath, userSocket } from "@/store";
import { Editor as VsEditor, OnMount } from "@monaco-editor/react";
import { useRecoilValue } from "recoil";
import { languageExtensions } from "@/Mapping";
import { editor } from "monaco-editor";
import { debounce } from "lodash";

const Editor = ({ spaceId }: { spaceId: string }) => {
    const content = useRecoilValue(OpenedFileContent);
    const extension = useRecoilValue(OpenedFileExtension);
    const IncomingFile = useRecoilValue(IncomingChange);
    const ws = useRecoilValue(userSocket);
    const filePath = useRecoilValue(OpenedFilePath);

    const programmaticUpdateRef = useRef(false); // Flag to track programmatic changes

    const debouncedSendUsersEditorUpdate = debounce(() => {
        sendUsersEditorUpdate();
    }, 300);

    const editorRef = useRef<editor.IStandaloneCodeEditor | any>(null);
    const monacoRef = useRef<any>(null);

    const [editorContent, setEditorContent] = useState(content);
    const [editorExtension, setEditorExtension] = useState(extension);

    useEffect(() => {
        setEditorContent(content);
        setEditorExtension(extension);
    }, [content, extension]);

    const allChanges = useRef<any[]>([]);

    const handleEditorChange = (value: string | undefined, event?: editor.IModelContentChangedEvent) => {
        if (programmaticUpdateRef.current) return;
        if (!value) return;
        setEditorContent(value);

        if (!ws) return;

        const changes = event?.changes.map((change) => ({
            rangeOffSet: change.rangeOffset,
            rangeLength: change.rangeLength,
            text: change.text,
        }));
        if (!changes) return;
        allChanges.current.push(...changes);
        debouncedSendUsersEditorUpdate();
    };

    const sendUsersEditorUpdate = () => {
        if (!ws || allChanges.current.length <= 0) return;
        ws.send(
            JSON.stringify({
                type: "file-update",
                payload: {
                    filePath,
                    changes: allChanges.current,
                    ws,
                    spaceId,
                    fullChange: editorContent,
                },
            })
        );
        allChanges.current = [];
    };

    useEffect(() => {
        if (!IncomingFile || !editorRef.current || IncomingFile.filePath !== filePath) return;

        const editor = editorRef.current;
        const model = editor.getModel();

        if (!model) return;

        if (IncomingFile.fileChanges && IncomingFile.fileChanges.length > 0) {

            programmaticUpdateRef.current = true;

            editor.focus();

            const sortedChanges = [...IncomingFile.fileChanges].sort((a, b) => a.rangeOffSet - b.rangeOffSet);

            sortedChanges.forEach(change => {
                const startPosition = model.getPositionAt(change.rangeOffSet);
                const range = new monacoRef.current.Range(
                    startPosition.lineNumber,
                    startPosition.column,
                    startPosition.lineNumber,
                    startPosition.column
                );

                editor.executeEdits('remote-changes', [{
                    range,
                    text: change.text
                }]);

                const newPosition = model.getPositionAt(change.rangeOffSet + change.text.length);
                editor.setPosition(newPosition);

                editor.focus();
            });

            setEditorContent(model.getValue());

            programmaticUpdateRef.current = false;
        }
    }, [IncomingFile, filePath]);

    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#0A0A0A",
                "editor.foreground": "#FFFFFF",
            },
        });

        monaco.editor.setTheme("custom-dark");

        programmaticUpdateRef.current = false;
    };

    return (
        <div className="w-full h-full">
            <VsEditor
                value={editorContent}
                language={languageExtensions[editorExtension]}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={{
                    fontSize: 20,
                    minimap: {
                        enabled: true,
                        side: "right",
                        renderCharacters: true,
                        scale: 1,
                    },
                    automaticLayout: true,
                    wordWrap: "on",
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorStyle: "line",
                }}
            />
        </div>
    );
};

export default Editor;
