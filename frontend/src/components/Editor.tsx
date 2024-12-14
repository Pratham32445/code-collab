import { useState, useEffect, useRef } from "react";
import { IncomingChange, OpenedFileContent, OpenedFileExtension, OpenedFilePath, userSocket } from "@/store";
import { Editor as VsEditor, OnMount } from "@monaco-editor/react";
import { useRecoilValue } from "recoil";
import { languageExtensions } from "@/Mapping";

const Editor = ({ spaceId }: { spaceId: string }) => {
    const content = useRecoilValue(OpenedFileContent);
    const extension = useRecoilValue(OpenedFileExtension);
    const IncomingFile = useRecoilValue(IncomingChange);
    const ws = useRecoilValue(userSocket);
    const filePath = useRecoilValue(OpenedFilePath);

    const editorRef = useRef<any>(null); // Reference for the editor instance
    const monacoRef = useRef<any>(null); // Reference for the Monaco instance

    const [editorContent, setEditorContent] = useState(content);
    const [editorExtension, setEditorExtension] = useState(extension);

    useEffect(() => {
        setEditorContent(content);
        setEditorExtension(extension);
    }, [content, extension]);

    useEffect(() => {
        if (IncomingFile && filePath === IncomingFile.filePath) {
            setEditorContent(IncomingFile.fileContent);
        }
    }, [IncomingFile]);

    const handleEditorChange = (value: string | undefined) => {
        if (!value) return;
        setEditorContent(value);
        if (!ws) return;
        ws.send(
            JSON.stringify({
                type: "file-update",
                payload: {
                    filePath,
                    content: value,
                    ws,
                    spaceId,
                },
            })
        );
    };

    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor; // Store the editor instance
        monacoRef.current = monaco; // Store the Monaco instance

        // Define a custom theme
        monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#0A0A0A", // Black background
                "editor.foreground": "#FFFFFF", // White text color
            },
        });

        // Apply the custom theme
        monaco.editor.setTheme("custom-dark");
    };

    return (
        <div className="w-full h-full">
            <VsEditor
                value={editorContent}
                // @ts-ignore
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
