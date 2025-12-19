"use client";

import { useState } from "react";
import { Sparkles, Code2, Eye, Play, Settings } from "lucide-react";
import { ChatInterface } from "@/components/studio/chat-interface";
import { CodeEditor } from "@/components/studio/code-editor";
import { DeployPanel } from "@/components/studio/deploy-panel";
import { VisualBuilder } from "@/components/studio/visual-builder";

type View = "chat" | "code" | "visual" | "deploy";

interface ProjectData {
    projectId: string;
    name: string;
    description: string;
    files: Array<{ path: string; language: string; content?: string }>;
    code?: string;
    fileCount?: number;
}

export default function StudioPage() {
    const [currentView, setCurrentView] = useState<View>("chat");
    const [projectData, setProjectData] = useState<ProjectData | null>(null);

    const tabs = [
        { id: "chat" as View, label: "AI Chat", icon: Sparkles },
        { id: "code" as View, label: "Code Editor", icon: Code2 },
        { id: "visual" as View, label: "Visual Builder", icon: Eye },
        { id: "deploy" as View, label: "Deploy", icon: Play },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Motia Studio Pro</h1>
                            <p className="text-xs text-slate-400">AI-Powered Backend Builder</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = currentView === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setCurrentView(tab.id)}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${isActive
                                            ? "bg-primary-600 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Settings */}
                    <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden bg-slate-950" style={{ height: 'calc(100vh - 60px)' }}>
                {currentView === "chat" && (
                    <ChatInterface
                        onCodeGenerated={(data) => {
                            setProjectData(data);
                            setCurrentView("code");
                        }}
                    />
                )}

                {currentView === "code" && (
                    <CodeEditor
                        projectData={projectData}
                        onDeploy={() => setCurrentView("deploy")}
                    />
                )}

                {currentView === "visual" && (
                    <VisualBuilder
                        projectId={projectData?.projectId || null}
                        onGenerateCode={() => setCurrentView("code")}
                        onDeploy={() => setCurrentView("deploy")}
                    />
                )}

                {currentView === "deploy" && (
                    <DeployPanel
                        projectId={projectData?.projectId || null}
                        projectData={projectData}
                    />
                )}
            </main>
        </div>
    );
}
