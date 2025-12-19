"use client";

import { useEffect, useState } from "react";
import { Activity, Zap, AlertCircle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ObservabilityDashboardProps {
    projectId?: string | null;
    deploymentUrl?: string | null;
}

export function ObservabilityDashboard({ projectId, deploymentUrl }: ObservabilityDashboardProps) {
    const [metrics, setMetrics] = useState(generateMockMetrics());
    const [logs, setLogs] = useState(generateMockLogs());

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(generateMockMetrics());
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (!projectId) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Deployment</h3>
                    <p className="text-slate-400">Deploy a project to see observability metrics</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: "Requests /min",
            value: "1,234",
            change: "+12%",
            icon: TrendingUp,
            color: "text-green-400",
            bgColor: "bg-green-500/10",
        },
        {
            label: "Avg Latency",
            value: "45ms",
            change: "-8%",
            icon: Zap,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
        },
        {
            label: "Error Rate",
            value: "0.1%",
            change: "-2%",
            icon: AlertCircle,
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/10",
        },
        {
            label: "Success Rate",
            value: "99.9%",
            change: "+0.1%",
            icon: CheckCircle,
            color: "text-green-400",
            bgColor: "bg-green-500/10",
        },
    ];

    return (
        <div className="h-full bg-slate-950 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Observability Dashboard</h2>
                        <p className="text-slate-400 text-sm">Real-time monitoring for {deploymentUrl}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-slate-400">Live</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request Rate Chart */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Request Rate</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={metrics.requestRate}>
                                <defs>
                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="requests"
                                    stroke="#6366f1"
                                    fillOpacity={1}
                                    fill="url(#colorRequests)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Latency Chart */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Average Latency</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={metrics.latency}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="ms"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Logs Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Live Logs</h3>
                        <button className="text-sm text-primary-400 hover:text-primary-300">
                            Export Logs
                        </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
                        {logs.map((log, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg ${log.level === 'error'
                                        ? 'bg-red-500/10 border border-red-500/20'
                                        : log.level === 'warn'
                                            ? 'bg-yellow-500/10 border border-yellow-500/20'
                                            : 'bg-slate-800/50 border border-slate-700'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-slate-500 flex-shrink-0">{log.timestamp}</span>
                                    <span
                                        className={`flex-shrink-0 ${log.level === 'error'
                                                ? 'text-red-400'
                                                : log.level === 'warn'
                                                    ? 'text-yellow-400'
                                                    : 'text-green-400'
                                            }`}
                                    >
                                        [{log.level.toUpperCase()}]
                                    </span>
                                    <span className="text-slate-300 flex-1">{log.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workflow Execution Trace */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Workflow Executions</h3>
                    <div className="space-y-3">
                        {generateMockWorkflowExecutions().map((execution) => (
                            <div key={execution.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-medium">{execution.name}</span>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${execution.status === 'completed'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : execution.status === 'running'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}
                                        >
                                            {execution.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {execution.duration}
                                        </span>
                                        <span>{execution.steps} steps</span>
                                        <span>{execution.timestamp}</span>
                                    </div>
                                </div>
                                <button className="text-sm text-primary-400 hover:text-primary-300">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mock data generators
function generateMockMetrics() {
    return {
        requestRate: Array.from({ length: 12 }, (_, i) => ({
            time: `${i}:00`,
            requests: Math.floor(Math.random() * 1000) + 500,
        })),
        latency: Array.from({ length: 12 }, (_, i) => ({
            time: `${i}:00`,
            ms: Math.floor(Math.random() * 50) + 30,
        })),
    };
}

function generateMockLogs() {
    const levels = ['info', 'warn', 'error'] as const;
    const messages = [
        'Payment processing workflow started',
        'Stripe payment intent created successfully',
        'Database query executed in 12ms',
        'Fraud detection analysis completed',
        'Warning: High memory usage detected',
        'Email notification sent to customer',
        'API rate limit approaching threshold',
        'Background job completed successfully',
    ];

    return Array.from({ length: 8 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 30000).toLocaleTimeString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[i % messages.length],
    }));
}

function generateMockWorkflowExecutions() {
    return [
        {
            id: '1',
            name: 'checkout-workflow',
            status: 'completed',
            duration: '1.2s',
            steps: 6,
            timestamp: '2 min ago',
        },
        {
            id: '2',
            name: 'ai-analysis-workflow',
            status: 'running',
            duration: '0.8s',
            steps: 5,
            timestamp: '5 min ago',
        },
        {
            id: '3',
            name: 'webhook-processing',
            status: 'completed',
            duration: '0.3s',
            steps: 3,
            timestamp: '12 min ago',
        },
    ];
}
