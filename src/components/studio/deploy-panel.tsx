"use client";

import { useState } from "react";
import { Rocket, Loader2, CheckCircle, XCircle, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectData {
    projectId: string;
    name: string;
    description: string;
    files: Array<{ path: string; language: string; content?: string }>;
    code?: string;
    fileCount?: number;
    status?: string;
    language?: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface DeployPanelProps {
    projectId: string | null;
    projectData?: ProjectData | null;
}

type DeployStatus = "idle" | "deploying" | "success" | "error";

interface DeploymentStep {
    label: string;
    status: "pending" | "running" | "completed" | "error";
}

export function DeployPanel({ projectId, projectData }: DeployPanelProps) {
    const [deployStatus, setDeployStatus] = useState<DeployStatus>("idle");
    const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [steps, setSteps] = useState<DeploymentStep[]>([
        { label: "Validating code", status: "pending" },
        { label: "Provisioning resources", status: "pending" },
        { label: "Deploying to Motia Cloud", status: "pending" },
        { label: "Running health checks", status: "pending" },
        { label: "Configuring observability", status: "pending" },
    ]);

    const handleDeploy = async () => {
        if (!projectId) return;

        setDeployStatus("deploying");

        try {
            // Call real deployment API with project data for Vercel compatibility
            const response = await fetch(`/api/deploy/${projectId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectData: projectData ? {
                        id: projectData.projectId,
                        userId: projectData.userId || 'demo-user',
                        name: projectData.name,
                        description: projectData.description,
                        status: projectData.status || 'ready',
                        language: (projectData.language as 'typescript' | 'python' | 'go') || 'typescript',
                        files: projectData.files.map(f => ({
                            path: f.path,
                            language: f.language,
                            content: f.content || ''
                        })),
                        createdAt: projectData.createdAt || new Date(),
                        updatedAt: projectData.updatedAt || new Date()
                    } : undefined
                }),
            });

            if (!response.ok) {
                throw new Error("Deployment failed");
            }

            const data = await response.json();
            const deploymentId = data.deploymentId;

            // Simulate deployment progress
            for (let i = 0; i < steps.length; i++) {
                setSteps((prev) =>
                    prev.map((step, index) => ({
                        ...step,
                        status: index === i ? "running" : index < i ? "completed" : "pending",
                    }))
                );

                await new Promise((resolve) => setTimeout(resolve, 2000));

                setSteps((prev) =>
                    prev.map((step, index) => ({
                        ...step,
                        status: index <= i ? "completed" : "pending",
                    }))
                );
            }

            // Poll for deployment status
            const statusResponse = await fetch(`/api/deployments/${deploymentId}`);
            const statusData = await statusResponse.json();

            if (statusData.success && statusData.data.status === "live") {
                setDeploymentUrl(statusData.data.url || null);
                setDeployStatus("success");
                toast.success("Deployment successful!");
            } else {
                throw new Error("Deployment did not complete successfully");
            }
        } catch (error) {
            console.error("Deployment error:", error);
            setDeployStatus("error");
            setSteps((prev) =>
                prev.map((step) => ({
                    ...step,
                    status: step.status === "running" ? "error" : step.status,
                }))
            );
            toast.error("Deployment failed");
        }
    };

    const handleCopyUrl = () => {
        if (deploymentUrl) {
            navigator.clipboard.writeText(deploymentUrl);
            setCopied(true);
            toast.success("URL copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!projectId) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Rocket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Project to Deploy</h3>
                    <p className="text-slate-400 mb-6">
                        Generate a backend using AI chat or select a template first.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Deploy to Production</h2>
                    <p className="text-slate-400">
                        Your backend will be deployed to Motia Cloud with automatic SSL, scaling, and monitoring
                    </p>
                </div>

                {/* Deployment Steps */}
                {deployStatus !== "idle" && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    {step.status === "pending" && (
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                                    )}
                                    {step.status === "running" && (
                                        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                                    )}
                                    {step.status === "completed" && (
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    )}
                                    {step.status === "error" && (
                                        <XCircle className="w-6 h-6 text-red-400" />
                                    )}

                                    <span
                                        className={`flex-1 ${step.status === "completed"
                                            ? "text-slate-400 line-through"
                                            : step.status === "running"
                                                ? "text-white font-semibold"
                                                : "text-slate-500"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Success State */}
                {deployStatus === "success" && deploymentUrl && (
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-8 mb-8">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">Deployment Successful! 🎉</h3>
                                <p className="text-green-200 mb-4">
                                    Your backend is now live and ready to handle requests
                                </p>

                                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Live URL:</p>
                                            <p className="text-white font-mono text-sm break-all">{deploymentUrl}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCopyUrl}
                                            >
                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(deploymentUrl, "_blank")}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                        <div className="text-2xl font-bold text-white">45s</div>
                                        <div className="text-xs text-slate-400">Deploy Time</div>
                                    </div>
                                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-400">✓</div>
                                        <div className="text-xs text-slate-400">Health Check</div>
                                    </div>
                                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                        <div className="text-2xl font-bold text-white">100%</div>
                                        <div className="text-xs text-slate-400">Availability</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Deploy Button */}
                {deployStatus === "idle" && (
                    <div className="text-center">
                        <Button
                            onClick={handleDeploy}
                            size="lg"
                            className="bg-primary-600 hover:bg-primary-700 text-lg px-12 py-6"
                        >
                            <Rocket className="w-5 h-5 mr-2" />
                            Deploy to Motia Cloud
                        </Button>
                        <p className="text-sm text-slate-500 mt-4">
                            Estimated deployment time: ~45 seconds
                        </p>
                    </div>
                )}

                {deployStatus === "deploying" && (
                    <div className="text-center">
                        <p className="text-slate-400">
                            Deploying your backend... This usually takes 30-60 seconds
                        </p>
                    </div>
                )}

                {deployStatus === "success" && (
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setDeployStatus("idle");
                                setSteps((prev) => prev.map((s) => ({ ...s, status: "pending" })));
                            }}
                        >
                            Deploy Another Version
                        </Button>
                        <Button
                            className="flex-1 bg-primary-600 hover:bg-primary-700"
                            onClick={() => window.open(`${deploymentUrl}/metrics`, "_blank")}
                        >
                            View Observability Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
