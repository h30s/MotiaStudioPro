"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileCode, Play, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectData {
    projectId: string;
    name: string;
    description: string;
    files: Array<{ path: string; language: string; content?: string }>;
    code?: string;
    fileCount?: number;
}

interface CodeEditorProps {
    projectData: ProjectData | null;
    onDeploy: () => void;
}

interface FileNode {
    name: string;
    path: string;
    content: string;
    language: string;
}

export function CodeEditor({ projectData, onDeploy }: CodeEditorProps) {
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [copied, setCopied] = useState(false);

    // Convert projectData files to FileNode format
    const files: FileNode[] = projectData?.files?.map(f => ({
        name: f.path.split('/').pop() || f.path,
        path: f.path,
        content: f.content || projectData.code || '',
        language: f.language || 'typescript',
    })) || [];

    // Fallback to displaying code if no files structure
    if (files.length === 0 && projectData?.code) {
        files.push({
            name: 'main.ts',
            path: 'src/main.ts',
            content: projectData.code,
            language: 'typescript',
        });
    }

    const handleCopy = () => {
        if (selectedFile) {
            navigator.clipboard.writeText(selectedFile.content);
            setCopied(true);
            toast.success("Code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (selectedFile) {
            const blob = new Blob([selectedFile.content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = selectedFile.name;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("File downloaded!");
        }
    };

    // Select first file by default
    if (!selectedFile && files.length > 0) {
        setSelectedFile(files[0]);
    }

    return (
        <div className="absolute inset-0 flex overflow-hidden bg-slate-950">
            {/* File Tree Sidebar */}
            <div className="w-64 border-r border-slate-800 bg-slate-900/50 overflow-y-auto flex-shrink-0">
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Project Files</h3>
                    <div className="space-y-1">
                        {files.map((file) => (
                            <button
                                key={file.path}
                                onClick={() => setSelectedFile(file)}
                                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2
                  ${selectedFile?.path === file.path
                                        ? "bg-primary-600 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }
                `}
                            >
                                <FileCode className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm truncate">{file.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="text-xs text-slate-500 space-y-2">
                        <div className="flex items-center justify-between">
                            <span>Files:</span>
                            <span className="text-slate-400">{files.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Language:</span>
                            <span className="text-slate-400">TypeScript</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Framework:</span>
                            <span className="text-slate-400">Motia</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col">
                {/* Editor Header */}
                <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <FileCode className="w-5 h-5 text-primary-400" />
                        <span className="text-sm text-slate-300">
                            {selectedFile?.path || "No file selected"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="text-slate-400 hover:text-white"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="text-slate-400 hover:text-white"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            onClick={onDeploy}
                            className="bg-primary-600 hover:bg-primary-700"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Deploy
                        </Button>
                    </div>
                </div>

                {/* Monaco Editor - FORCED FULL HEIGHT */}
                <div className="flex-1" style={{ height: 'calc(100vh - 120px)' }}>
                    {selectedFile ? (
                        <Editor
                            height="100%"
                            language={selectedFile.language}
                            value={selectedFile.content}
                            onChange={(value) => {
                                if (selectedFile && value !== undefined) {
                                    const updatedFile = { ...selectedFile, content: value };
                                    setSelectedFile(updatedFile);
                                }
                            }}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                lineNumbers: "on",
                                rulers: [80, 120],
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                formatOnPaste: true,
                                formatOnType: true,
                            }}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <FileCode className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-400">Select a file to view</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
