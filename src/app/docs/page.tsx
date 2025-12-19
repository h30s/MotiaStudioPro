"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    Code2,
    Rocket,
    Sparkles,
    Terminal,
    Zap,
    Eye,
    GitBranch,
    FileCode,
    Settings,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
    { id: "introduction", title: "Introduction", icon: BookOpen },
    { id: "quick-start", title: "Quick Start", icon: Zap },
    { id: "features", title: "Features", icon: Sparkles },
    { id: "ai-generation", title: "AI Code Generation", icon: Code2 },
    { id: "visual-builder", title: "Visual Builder", icon: GitBranch },
    { id: "templates", title: "Templates", icon: FileCode },
    { id: "deployment", title: "Deployment", icon: Rocket },
    { id: "observability", title: "Observability", icon: Eye },
    { id: "api-reference", title: "API Reference", icon: Terminal },
    { id: "best-practices", title: "Best Practices", icon: CheckCircle2 },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-400" />
                            <span className="text-xl font-bold text-white">Documentation</span>
                        </div>
                    </div>
                    <Link href="/studio">
                        <Button className="bg-primary-600 hover:bg-primary-700">
                            Open Studio
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase">Contents</h3>
                            <nav className="space-y-1">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                                                    ? "bg-primary-600 text-white"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {section.title}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
                            <DocumentationContent activeSection={activeSection} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function DocumentationContent({ activeSection }: { activeSection: string }) {
    switch (activeSection) {
        case "introduction":
            return <Introduction />;
        case "quick-start":
            return <QuickStart />;
        case "features":
            return <Features />;
        case "ai-generation":
            return <AIGeneration />;
        case "visual-builder":
            return <VisualBuilder />;
        case "templates":
            return <Templates />;
        case "deployment":
            return <Deployment />;
        case "observability":
            return <Observability />;
        case "api-reference":
            return <APIReference />;
        case "best-practices":
            return <BestPractices />;
        default:
            return <Introduction />;
    }
}

function Introduction() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Motia Studio Pro</h1>
            <p className="text-xl text-slate-300 mb-8">
                The AI-powered IDE for building production backends in seconds, not hours.
            </p>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 mb-8">
                <h3 className="text-primary-400 font-semibold mb-2">What is Motia Studio Pro?</h3>
                <p className="text-slate-300">
                    Motia Studio Pro is a comprehensive development environment built specifically for Motia's unified backend runtime.
                    It combines AI code generation, visual workflow building, and instant deployment into a seamless experience.
                </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Why Motia Studio Pro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">10x Faster Development</h3>
                    <p className="text-slate-400 text-sm">
                        Go from idea to deployed backend in 90 seconds with AI-powered code generation.
                    </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <Code2 className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">Production-Ready Code</h3>
                    <p className="text-slate-400 text-sm">
                        AI generates clean, maintainable code following Motia best practices.
                    </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <Eye className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">Built-in Observability</h3>
                    <p className="text-slate-400 text-sm">
                        Monitor your backend's performance with real-time metrics and logs.
                    </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <Rocket className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">One-Click Deploy</h3>
                    <p className="text-slate-400 text-sm">
                        Deploy to production with a single click, powered by Motia's infrastructure.
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Capabilities</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Natural language to production-ready Motia code using advanced AI</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Visual drag-and-drop workflow builder with code synchronization</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Pre-built templates for common backend patterns</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Monaco editor with full TypeScript support and IntelliSense</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Integrated deployment pipeline with Vercel</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Real-time observability dashboards with metrics and logs</span>
                </li>
            </ul>
        </div>
    );
}

function QuickStart() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Quick Start Guide</h1>
            <p className="text-xl text-slate-300 mb-8">
                Get up and running with Motia Studio Pro in minutes.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Prerequisites</h2>
            <ul className="text-slate-300 space-y-2">
                <li>Node.js 18+ installed</li>
                <li>Groq API key (for AI code generation)</li>
                <li>Basic understanding of TypeScript and backend development</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Installation</h2>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400">
                    <div># Clone the repository</div>
                    <div>git clone https://github.com/h30s/MotiaStudioPro.git</div>
                    <div className="mt-2"># Navigate to directory</div>
                    <div>cd MotiaStudioPro</div>
                    <div className="mt-2"># Install dependencies</div>
                    <div>npm install</div>
                </code>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Environment Setup</h2>
            <p className="text-slate-300 mb-4">Create a <code className="text-primary-400">.env</code> file in the root directory:</p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400">
                    <div>GROQ_API_KEY=your_groq_api_key_here</div>
                    <div>VERCEL_TOKEN=your_vercel_token_here</div>
                    <div>MOTIA_API_KEY=your_motia_api_key_here</div>
                </code>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Run Development Server</h2>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400">
                    <div>npm run dev</div>
                </code>
            </div>
            <p className="text-slate-300 mb-6">
                Open <a href="http://localhost:3000" className="text-primary-400 hover:underline">http://localhost:3000</a> in your browser.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Your First Backend</h2>
            <div className="space-y-4 text-slate-300">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">1</div>
                        <h3 className="text-white font-semibold">Navigate to Studio</h3>
                    </div>
                    <p className="text-sm">Click "Open Studio" in the navigation bar or visit <code className="text-primary-400">/studio</code></p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">2</div>
                        <h3 className="text-white font-semibold">Choose a Method</h3>
                    </div>
                    <p className="text-sm">Start from a template or use AI to describe your backend in plain English</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">3</div>
                        <h3 className="text-white font-semibold">AI Generation</h3>
                    </div>
                    <p className="text-sm">Type: "Create a REST API for user authentication with JWT tokens"</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">4</div>
                        <h3 className="text-white font-semibold">Review & Edit</h3>
                    </div>
                    <p className="text-sm">AI generates the code. Review and customize in the Monaco editor</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">5</div>
                        <h3 className="text-white font-semibold">Deploy</h3>
                    </div>
                    <p className="text-sm">Click "Deploy" and watch your backend go live in 90 seconds!</p>
                </div>
            </div>
        </div>
    );
}

function Features() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Core Features</h1>
            <p className="text-xl text-slate-300 mb-8">
                Explore the powerful features that make Motia Studio Pro unique.
            </p>

            <div className="space-y-8">
                <FeatureCard
                    icon={<Sparkles className="w-8 h-8 text-primary-400" />}
                    title="AI-Powered Code Generation"
                    description="Transform natural language descriptions into production-ready Motia code using state-of-the-art LLMs."
                    features={[
                        "Context-aware code generation",
                        "Follows Motia best practices",
                        "Supports complex backend architectures",
                        "Iterative refinement with chat interface"
                    ]}
                />

                <FeatureCard
                    icon={<GitBranch className="w-8 h-8 text-blue-400" />}
                    title="Visual Workflow Builder"
                    description="Design complex workflows visually with drag-and-drop nodes that sync with code in real-time."
                    features={[
                        "Drag-and-drop interface powered by ReactFlow",
                        "Real-time code synchronization",
                        "Pre-built nodes for common operations",
                        "Visual debugging and execution flow"
                    ]}
                />

                <FeatureCard
                    icon={<Code2 className="w-8 h-8 text-green-400" />}
                    title="Monaco Code Editor"
                    description="Industry-standard code editing experience with full TypeScript support."
                    features={[
                        "IntelliSense and auto-completion",
                        "Syntax highlighting for Motia code",
                        "Multi-file editing support",
                        "Keyboard shortcuts and commands"
                    ]}
                />

                <FeatureCard
                    icon={<Rocket className="w-8 h-8 text-purple-400" />}
                    title="One-Click Deployment"
                    description="Deploy your backend to production infrastructure in seconds with built-in CI/CD."
                    features={[
                        "Automated deployment pipeline",
                        "Environment variable management",
                        "Zero-downtime deployments",
                        "Deployment history and rollbacks"
                    ]}
                />

                <FeatureCard
                    icon={<Eye className="w-8 h-8 text-yellow-400" />}
                    title="Built-in Observability"
                    description="Monitor your backend's health and performance without external tools."
                    features={[
                        "Real-time metrics dashboard",
                        "Execution logs and traces",
                        "Performance analytics",
                        "Error tracking and alerts"
                    ]}
                />

                <FeatureCard
                    icon={<FileCode className="w-8 h-8 text-pink-400" />}
                    title="Template Library"
                    description="Jump-start your project with battle-tested templates for common use cases."
                    features={[
                        "Email service with multi-provider support",
                        "Webhook processor with validation",
                        "Data pipeline with ETL operations",
                        "Custom templates coming soon"
                    ]}
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, features }: any) {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-300">{description}</p>
                </div>
            </div>
            <ul className="space-y-2 ml-16">
                {features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function AIGeneration() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">AI Code Generation</h1>
            <p className="text-xl text-slate-300 mb-8">
                Learn how to leverage AI to generate production-ready Motia code.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">How It Works</h2>
            <p className="text-slate-300 mb-6">
                Motia Studio Pro uses advanced language models to understand your requirements and generate
                optimized Motia code that follows best practices.
            </p>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-8">
                <h3 className="text-white font-semibold mb-4">Example Prompts</h3>
                <div className="space-y-3">
                    <div className="bg-slate-950 rounded p-3">
                        <code className="text-primary-400 text-sm">
                            "Create a REST API for managing blog posts with CRUD operations"
                        </code>
                    </div>
                    <div className="bg-slate-950 rounded p-3">
                        <code className="text-primary-400 text-sm">
                            "Build a webhook processor that validates incoming data and forwards to multiple endpoints"
                        </code>
                    </div>
                    <div className="bg-slate-950 rounded p-3">
                        <code className="text-primary-400 text-sm">
                            "Set up a scheduled job that fetches data from an API every hour and stores it in a database"
                        </code>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Best Practices</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Be specific:</strong> Include details about data models, endpoints, and business logic</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Iterate:</strong> Use the chat interface to refine and improve generated code</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Review:</strong> Always review generated code before deploying to production</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Combine approaches:</strong> Start with AI, then use visual builder for fine-tuning</span>
                </li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Supported Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">✅ REST APIs</h3>
                    <p className="text-slate-400 text-sm">Generate complete REST API endpoints with validation</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">✅ Webhooks</h3>
                    <p className="text-slate-400 text-sm">Process incoming webhooks with custom logic</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">✅ Scheduled Jobs</h3>
                    <p className="text-slate-400 text-sm">Create cron-based background tasks</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">✅ Data Processing</h3>
                    <p className="text-slate-400 text-sm">ETL pipelines and data transformations</p>
                </div>
            </div>
        </div>
    );
}

function VisualBuilder() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Visual Workflow Builder</h1>
            <p className="text-xl text-slate-300 mb-8">
                Design complex backend workflows visually with our drag-and-drop interface.
            </p>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 mb-8">
                <h3 className="text-primary-400 font-semibold mb-2">Coming Soon!</h3>
                <p className="text-slate-300">
                    The visual workflow builder is currently in development. It will allow you to design
                    complex backend workflows by connecting nodes visually, with real-time code generation.
                </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Planned Features</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <div className="w-5 h-5 border-2 border-slate-600 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Drag-and-drop node-based interface</span>
                </li>
                <li className="flex items-start gap-2">
                    <div className="w-5 h-5 border-2 border-slate-600 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Real-time code synchronization</span>
                </li>
                <li className="flex items-start gap-2">
                    <div className="w-5 h-5 border-2 border-slate-600 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Pre-built nodes for common operations</span>
                </li>
                <li className="flex items-start gap-2">
                    <div className="w-5 h-5 border-2 border-slate-600 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Visual execution flow debugging</span>
                </li>
            </ul>
        </div>
    );
}

function Templates() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Template Library</h1>
            <p className="text-xl text-slate-300 mb-8">
                Pre-built, production-ready templates to accelerate your development.
            </p>

            <div className="space-y-6">
                <TemplateCard
                    title="📧 Email Service"
                    description="Multi-provider email service with templates, queuing, and delivery tracking"
                    features={[
                        "Support for SendGrid, Mailgun, and SMTP",
                        "Template management and rendering",
                        "Queue-based sending with retry logic",
                        "Delivery status webhooks"
                    ]}
                    useCase="Perfect for applications that need reliable email delivery"
                />

                <TemplateCard
                    title="🔗 Webhook Processor"
                    description="Enterprise-grade webhook processor with validation and routing"
                    features={[
                        "Request validation and signature verification",
                        "Data transformation pipelines",
                        "Multi-endpoint forwarding",
                        "Retry logic and dead letter queues"
                    ]}
                    useCase="Ideal for integrating with third-party services"
                />

                <TemplateCard
                    title="📊 Data Pipeline"
                    description="ETL pipeline for data extraction, transformation, and loading"
                    features={[
                        "Scheduled data fetching",
                        "Data transformation and enrichment",
                        "Database storage with migrations",
                        "Error handling and monitoring"
                    ]}
                    useCase="Great for data aggregation and analytics workflows"
                />

                <TemplateCard
                    title="🚪 API Gateway"
                    description="Centralized API gateway with authentication and rate limiting"
                    features={[
                        "JWT-based authentication",
                        "Rate limiting and throttling",
                        "Request/response transformation",
                        "API key management"
                    ]}
                    useCase="Essential for managing multiple microservices"
                />

                <TemplateCard
                    title="⚡ Real-time Notifications"
                    description="Push notification service with multi-channel support"
                    features={[
                        "Email, SMS, and push notifications",
                        "User preference management",
                        "Template-based messaging",
                        "Delivery analytics"
                    ]}
                    useCase="Perfect for user engagement and alerts"
                />
            </div>
        </div>
    );
}

function TemplateCard({ title, description, features, useCase }: any) {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 mb-4">{description}</p>

            <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Features:</h4>
                <ul className="space-y-1">
                    {features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-400 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded p-3">
                <p className="text-primary-400 text-sm">
                    <strong>Use Case:</strong> {useCase}
                </p>
            </div>
        </div>
    );
}

function Deployment() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Deployment Guide</h1>
            <p className="text-xl text-slate-300 mb-8">
                Deploy your Motia backends to production in seconds with our one-click deployment.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Deployment Process</h2>
            <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">1</div>
                        <h3 className="text-white font-semibold">Configure Environment</h3>
                    </div>
                    <p className="text-slate-400 text-sm ml-8">
                        Set up your environment variables in the deployment panel
                    </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">2</div>
                        <h3 className="text-white font-semibold">Click Deploy</h3>
                    </div>
                    <p className="text-slate-400 text-sm ml-8">
                        Click the "Deploy" button in the deploy panel
                    </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">3</div>
                        <h3 className="text-white font-semibold">Automated Build</h3>
                    </div>
                    <p className="text-slate-400 text-sm ml-8">
                        Our CI/CD pipeline builds and tests your code automatically
                    </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">4</div>
                        <h3 className="text-white font-semibold">Live in 90 Seconds</h3>
                    </div>
                    <p className="text-slate-400 text-sm ml-8">
                        Your backend is deployed and accessible via a production URL
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Environment Variables</h2>
            <p className="text-slate-300 mb-4">
                Securely manage your API keys and configuration:
            </p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400 text-sm">
                    <div>DATABASE_URL=postgresql://...</div>
                    <div>API_KEY=sk-...</div>
                    <div>WEBHOOK_SECRET=whsec_...</div>
                </code>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Deployment Features</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Zero-downtime deployments</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Automatic HTTPS with SSL certificates</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Global CDN for low latency</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Deployment history and rollbacks</span>
                </li>
            </ul>
        </div>
    );
}

function Observability() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Observability</h1>
            <p className="text-xl text-slate-300 mb-8">
                Monitor your backend's health and performance with built-in observability tools.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Metrics Dashboard</h2>
            <p className="text-slate-300 mb-6">
                Real-time metrics help you understand your backend's performance:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">📊 Request Volume</h3>
                    <p className="text-slate-400 text-sm">Track requests per second and total volume</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">⏱️ Response Time</h3>
                    <p className="text-slate-400 text-sm">Monitor P50, P95, and P99 latencies</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">❌ Error Rate</h3>
                    <p className="text-slate-400 text-sm">Track 4xx and 5xx error percentages</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-white font-semibold mb-2">🔄 Success Rate</h3>
                    <p className="text-slate-400 text-sm">View overall success rate and trends</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Execution Logs</h2>
            <p className="text-slate-300 mb-6">
                Detailed logs for debugging and troubleshooting:
            </p>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Real-time log streaming</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Searchable and filterable logs</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Execution traces with timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Error stack traces</span>
                </li>
            </ul>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 mt-8">
                <h3 className="text-primary-400 font-semibold mb-2">Pro Tip</h3>
                <p className="text-slate-300">
                    Use the observability dashboard to identify performance bottlenecks and optimize
                    your backend for production workloads.
                </p>
            </div>
        </div>
    );
}

function APIReference() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
            <p className="text-xl text-slate-300 mb-8">
                Reference documentation for Studio Pro's backend APIs.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">POST /api/generate</h2>
            <p className="text-slate-300 mb-4">Generate Motia code from natural language description.</p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400 text-sm">
                    <div>{'{'}</div>
                    <div>  "prompt": "Create a REST API for blog posts",</div>
                    <div>  "context": "Existing project context (optional)"</div>
                    <div>{'}'}</div>
                </code>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">POST /api/projects</h2>
            <p className="text-slate-300 mb-4">Create a new project.</p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400 text-sm">
                    <div>{'{'}</div>
                    <div>  "name": "My Backend",</div>
                    <div>  "description": "Description here",</div>
                    <div>  "code": "// Motia code"</div>
                    <div>{'}'}</div>
                </code>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">GET /api/projects/:id</h2>
            <p className="text-slate-300 mb-4">Retrieve project details by ID.</p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">POST /api/deploy/:id</h2>
            <p className="text-slate-300 mb-4">Deploy a project to production.</p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-6">
                <code className="text-primary-400 text-sm">
                    <div>{'{'}</div>
                    <div>  "envVars": {'{'}</div>
                    <div>    "API_KEY": "sk-..."</div>
                    <div>  {'}'}</div>
                    <div>{'}'}</div>
                </code>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">GET /api/templates</h2>
            <p className="text-slate-300 mb-4">List all available templates.</p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">GET /api/templates/:id</h2>
            <p className="text-slate-300 mb-4">Get template details and code by ID.</p>
        </div>
    );
}

function BestPractices() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">Best Practices</h1>
            <p className="text-xl text-slate-300 mb-8">
                Tips and guidelines for getting the most out of Motia Studio Pro.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Code Generation</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Be specific:</strong> Include details about data models, validation rules, and error handling</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Use examples:</strong> Provide example requests/responses to guide AI generation</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Iterate:</strong> Refine generated code through multiple chat iterations</span>
                </li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Development Workflow</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Start with templates:</strong> Use templates as a foundation for custom backends</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Review before deploy:</strong> Always review AI-generated code before deploying</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Use version control:</strong> Save project versions before major changes</span>
                </li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Production Deployment</h2>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Environment variables:</strong> Always use env vars for sensitive data</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Monitor metrics:</strong> Watch observability dashboard after deployment</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Test endpoints:</strong> Verify all endpoints work as expected</span>
                </li>
            </ul>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mt-8">
                <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Production Checklist</h3>
                <ul className="space-y-1 text-slate-300 text-sm">
                    <li>✓ All environment variables are set</li>
                    <li>✓ Error handling is implemented</li>
                    <li>✓ Rate limiting is configured</li>
                    <li>✓ Logging is enabled</li>
                    <li>✓ Security best practices followed</li>
                </ul>
            </div>
        </div>
    );
}
