"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    onCodeGenerated: (code: string, projectId: string) => void;
}

export function ChatInterface({ onCodeGenerated }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "👋 Hi! I'm your AI backend architect. Describe the backend you want to build, and I'll generate production-ready Motia code for you.\n\nFor example:\n- \"Build a REST API for a todo app with CRUD operations\"\n- \"Create a payment processing system with fraud detection\"\n- \"Build a webhook handler for GitHub events\"",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fix hydration error by only rendering timestamps on client
    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsGenerating(true);

        try {
            // Call AI generation API
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: input }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate code");
            }

            const data = await response.json();

            // Add AI response
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `✅ Great! I've generated a ${data.name} for you.\n\n**What I created:**\n${data.files.map((f: any) => `- ${f.path}`).join("\n")}\n\n**Features:**\n${data.description}\n\nClick "View Code" to see the generated code and deploy it!`,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            toast.success("Code generated successfully!");

            // Notify parent component
            setTimeout(() => {
                onCodeGenerated(data.code, data.projectId);
            }, 1000);
        } catch (error) {
            console.error("Generation error:", error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "❌ Sorry, I encountered an error while generating your code. Please try again with a more specific description.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
            toast.error("Failed to generate code");
        } finally {
            setIsGenerating(false);
        }
    };

    const quickPrompts = [
        "REST API with CRUD operations",
        "AI agent workflow",
        "Background job queue",
        "Webhook handler",
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-2xl rounded-2xl p-4 ${message.role === "user"
                                ? "bg-primary-600 text-white"
                                : "bg-slate-800 text-slate-100"
                                }`}
                        >
                            {message.role === "assistant" && (
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-300">AI Assistant</span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {mounted && (
                                <div
                                    className={`text-xs mt-2 ${message.role === "user" ? "text-primary-200" : "text-slate-500"
                                        }`}
                                >
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="max-w-2xl rounded-2xl p-4 bg-slate-800">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                                <span className="text-slate-300">Generating your backend...</span>
                            </div>
                            <div className="mt-2 space-y-2">
                                <div className="text-sm text-slate-400">⚙️ Analyzing requirements...</div>
                                <div className="text-sm text-slate-400">📝 Generating Motia Steps...</div>
                                <div className="text-sm text-slate-400">✨ Adding best practices...</div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && !isGenerating && (
                <div className="px-6 pb-4">
                    <p className="text-sm text-slate-400 mb-3">Quick start:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                onClick={() => setInput(prompt)}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="border-t border-slate-800 p-6">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Describe your backend... (e.g., 'Build a REST API for user management with authentication')"
                        className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={3}
                        disabled={isGenerating}
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || isGenerating}
                        className="bg-primary-600 hover:bg-primary-700 px-6"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </form>
                <p className="text-xs text-slate-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
