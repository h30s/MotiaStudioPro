"use client";

import { useState } from "react";
import { Search, Filter, Sparkles, Play, Code2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const templates = [
    {
        id: "rest-api-crud",
        name: "REST API with CRUD",
        description: "Full-featured REST API with database operations, input validation, JWT auth, and pagination",
        category: "API",
        difficulty: "beginner",
        deployTime: "10s",
        features: ["CRUD Operations", "Input Validation", "JWT Auth", "Pagination"],
        icon: "🌐",
        color: "from-blue-500/20 to-blue-600/20",
        borderColor: "border-blue-500/30",
    },
    {
        id: "ai-agent-workflow",
        name: "AI Agent Workflow",
        description: "Multi-step AI processing pipeline with OpenAI, state management, and automatic retries",
        category: "AI",
        difficulty: "intermediate",
        deployTime: "12s",
        features: ["OpenAI Integration", "Durable Workflows", "State Management", "Error Recovery"],
        icon: "🤖",
        color: "from-purple-500/20 to-purple-600/20",
        borderColor: "border-purple-500/30",
    },
    {
        id: "job-queue",
        name: "Background Job Queue",
        description: "Async task processing with exponential backoff, job scheduling, and dead letter queue",
        category: "Jobs",
        difficulty: "intermediate",
        deployTime: "8s",
        features: ["Async Processing", "Retry Logic", "Job Scheduling", "Dead Letter Queue"],
        icon: "⚙️",
        color: "from-green-500/20 to-green-600/20",
        borderColor: "border-green-500/30",
    },
    {
        id: "ecommerce",
        name: "E-commerce Backend",
        description: "Complete shopping system with Stripe payments, cart management, and inventory tracking",
        category: "E-commerce",
        difficulty: "advanced",
        deployTime: "15s",
        features: ["Stripe Integration", "Cart Management", "Checkout Flow", "Inventory Tracking"],
        icon: "🛒",
        color: "from-orange-500/20 to-orange-600/20",
        borderColor: "border-orange-500/30",
    },
    {
        id: "webhook-handler",
        name: "Webhook Handler",
        description: "Secure webhook receiver with signature validation, idempotency, and event routing",
        category: "Events",
        difficulty: "beginner",
        deployTime: "8s",
        features: ["Signature Validation", "Idempotency", "Event Routing", "Error Recovery"],
        icon: "📡",
        color: "from-pink-500/20 to-pink-600/20",
        borderColor: "border-pink-500/30",
    },
];

export default function TemplatesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const router = useRouter();

    const categories = ["all", "API", "AI", "Jobs", "E-commerce", "Events"];

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleUseTemplate = (templateId: string) => {
        router.push(`/studio?template=${templateId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Motia Studio Pro</span>
                    </div>
                    <Button
                        onClick={() => router.push("/")}
                        variant="ghost"
                        className="text-slate-300"
                    >
                        Back to Home
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-bold text-white mb-4">Template Library</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Production-ready Motia backends. Customize and deploy in seconds.
                </p>

                {/* Search and Filter */}
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className={`group bg-gradient-to-br ${template.color} backdrop-blur-sm border ${template.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-5xl">{template.icon}</div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 rounded-full bg-slate-800/50 text-slate-400 text-xs">
                                        {template.difficulty}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs">
                                        {template.deployTime}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                            <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                                {template.description}
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {template.features.map((feature, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-1 rounded-full bg-slate-800/50 text-slate-300"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleUseTemplate(template.id)}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Use Template
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-slate-700 hover:bg-slate-800"
                                    onClick={() => router.push(`/templates/${template.id}`)}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
                        <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
                        <Button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
