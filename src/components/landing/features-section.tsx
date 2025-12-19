"use client";

import { Sparkles, Code2, Rocket, Eye, Workflow, Zap } from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "AI Code Generation",
        description: "Describe your backend in plain English. Our AI generates production-ready Motia code with best practices built-in.",
        color: "from-primary-500 to-primary-600",
    },
    {
        icon: Workflow,
        title: "Visual Workflow Builder",
        description: "See your backend as a beautiful diagram. Drag-and-drop Steps to build complex workflows visually.",
        color: "from-secondary-500 to-secondary-600",
    },
    {
        icon: Rocket,
        title: "One-Click Deploy",
        description: "Deploy to Motia Cloud in seconds. Get a live URL instantly with automatic SSL, scaling, and health checks.",
        color: "from-accent-500 to-accent-600",
    },
    {
        icon: Code2,
        title: "Smart Code Editor",
        description: "VS Code-powered editor with syntax highlighting, auto-completion, and Motia-specific features.",
        color: "from-blue-500 to-blue-600",
    },
    {
        icon: Eye,
        title: "Built-in Observability",
        description: "Real-time metrics, logs, and execution traces. Monitor everything from a unified dashboard.",
        color: "from-purple-500 to-purple-600",
    },
    {
        icon: Zap,
        title: "Template Library",
        description: "Start with pre-built backends for common use cases. Customize and deploy in seconds.",
        color: "from-orange-500 to-orange-600",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Everything You Need to Build
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Powered by Motia's unified runtime. All your backend needs in one place.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-300 hover:scale-105"
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                                <div className="relative">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Motia Features Highlight */}
                <div className="mt-20 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                        Showcases Motia's Power
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Steps", desc: "Core primitive" },
                            { label: "Durable Workflows", desc: "State persistence" },
                            { label: "Background Jobs", desc: "Async processing" },
                            { label: "Streaming", desc: "Real-time updates" },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-4 bg-slate-800/50 rounded-xl">
                                <div className="text-primary-400 font-semibold mb-1">{item.label}</div>
                                <div className="text-sm text-slate-500">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
