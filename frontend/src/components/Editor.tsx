import React, { useState, useEffect } from 'react';
import { OpenedFileContent, OpenedFileExtension, OpenedFilePath, userSocket } from "@/store";
import { Editor as VsEditor } from "@monaco-editor/react";
import { useRecoilValue } from "recoil";
import { languageExtensions } from '@/Mapping';

const Editor = () => {
    const content = useRecoilValue(OpenedFileContent);
    const extension = useRecoilValue(OpenedFileExtension);
    const [editorContent, setEditorContent] = useState(content);
    const [editorExtension, setEditorExtension] = useState(extension);
    const ws = useRecoilValue(userSocket);
    const filePath = useRecoilValue(OpenedFilePath);

    useEffect(() => {
        setEditorContent(content);
        setEditorExtension(extension);
    }, [content, extension]);

    const handleEditorChange = (value) => {
        setEditorContent(value);
        if (!ws) return;
        ws.send(JSON.stringify({
            type: "file-update",
            payload: {
                filePath,
                content : value
            }
        }))
    };

    return (
        <div className="w-full h-full">
            <VsEditor
                value={editorContent}
                language={languageExtensions[editorExtension]}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    fontSize: 20,
                    minimap: {
                        enabled: true,
                        side: 'right',
                        renderCharacters: true,
                        scale: 1
                    },
                    automaticLayout: true,
                    wordWrap: 'on',
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorStyle: 'line',
                    renderLineHighlight: 'all'
                }}
            />
        </div>
    );
};

export default Editor;