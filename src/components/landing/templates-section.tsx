"use client";

import { Button } from "@/components/ui/button";
import { Database, Bot, Cog, ShoppingCart, Webhook } from "lucide-react";
import Link from "next/link";

const templates = [
    {
        id: "rest-api",
        name: "REST API with CRUD",
        description: "Full-featured REST API with database operations, validation, and error handling",
        icon: Database,
        difficulty: "Beginner",
        deployTime: "10s",
        features: ["CRUD Operations", "Input Validation", "Error Handling", "Database Integration"],
        color: "from-blue-500 to-blue-600",
    },
    {
        id: "ai-agent",
        name: "AI Agent Workflow",
        description: "Multi-step AI processing pipeline with state management and retry logic",
        icon: Bot,
        difficulty: "Intermediate",
        deployTime: "12s",
        features: ["AI Integration", "Durable Workflows", "State Management", "Error Recovery"],
        color: "from-purple-500 to-purple-600",
    },
    {
        id: "job-queue",
        name: "Background Job Queue",
        description: "Async task processing with exponential backoff and comprehensive logging",
        icon: Cog,
        difficulty: "Intermediate",
        deployTime: "8s",
        features: ["Async Processing", "Retry Logic", "Job Scheduling", "Monitoring"],
        color: "from-green-500 to-green-600",
    },
    {
        id: "ecommerce",
        name: "E-commerce Backend",
        description: "Complete e-commerce system with cart, checkout, payments, and inventory",
        icon: ShoppingCart,
        difficulty: "Advanced",
        deployTime: "15s",
        features: ["Product Catalog", "Cart Management", "Payment Processing", "Inventory Tracking"],
        color: "from-orange-500 to-orange-600",
    },
    {
        id: "webhook-handler",
        name: "Webhook Handler",
        description: "Event processing system with signature validation and retry mechanisms",
        icon: Webhook,
        difficulty: "Beginner",
        deployTime: "8s",
        features: ["Signature Validation", "Event Processing", "Retry Logic", "Logging"],
        color: "from-pink-500 to-pink-600",
    },
];

export function TemplatesSection() {
    return (
        <section id="templates" className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Start with Templates
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Pre-built, production-ready backends. Customize and deploy in seconds.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => {
                        const Icon = template.icon;
                        return (
                            <div
                                key={template.id}
                                className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                                            {template.difficulty}
                                        </span>
                                        <span className="px-2 py-1 rounded-full bg-primary-500/10 text-primary-400">
                                            {template.deployTime}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    {template.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {template.features.map((feature, i) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Action */}
                                <Link href={`/studio?template=${template.id}`}>
                                    <Button variant="outline" className="w-full">
                                        Use Template
                                    </Button>
                                </Link>
                            </div>
                        );
                    })}

                    {/* Custom Template Card */}
                    <div className="group bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-2 border-dashed border-primary-500/30 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Custom with AI
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Describe your unique backend needs and let AI build it for you
                        </p>
                        <Link href="/studio">
                            <Button className="bg-primary-600 hover:bg-primary-700">
                                Build Custom
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
