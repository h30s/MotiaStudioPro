"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Workflow, Plus, Play, Code2 } from "lucide-react";

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'API Endpoint' },
        position: { x: 250, y: 5 },
        style: {
            background: '#6366f1',
            color: 'white',
            border: '1px solid #4f46e5',
            borderRadius: '8px',
            padding: '10px',
        },
    },
    {
        id: '2',
        data: { label: 'Validate Input' },
        position: { x: 250, y: 100 },
        style: {
            background: '#1e293b',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '10px',
        },
    },
    {
        id: '3',
        data: { label: 'Process Data' },
        position: { x: 250, y: 200 },
        style: {
            background: '#1e293b',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '10px',
        },
    },
    {
        id: '4',
        data: { label: 'Save to Database' },
        position: { x: 250, y: 300 },
        style: {
            background: '#1e293b',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '10px',
        },
    },
    {
        id: '5',
        type: 'output',
        data: { label: 'Return Response' },
        position: { x: 250, y: 400 },
        style: {
            background: '#10b981',
            color: 'white',
            border: '1px solid #059669',
            borderRadius: '8px',
            padding: '10px',
        },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
];

interface VisualBuilderProps {
    projectId?: string | null;
    onGenerateCode?: () => void;
    onDeploy?: () => void;
}

export function VisualBuilder({ projectId, onGenerateCode, onDeploy }: VisualBuilderProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Header */}
            <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Workflow className="w-5 h-5 text-primary-400" />
                    <span className="text-sm text-slate-300">Visual Workflow Builder</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Step
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onGenerateCode} className="text-slate-400 hover:text-white">
                        <Code2 className="w-4 h-4 mr-2" />
                        Generate Code
                    </Button>
                    <Button onClick={onDeploy} className="bg-primary-600 hover:bg-primary-700">
                        <Play className="w-4 h-4 mr-2" />
                        Deploy
                    </Button>
                </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    attributionPosition="bottom-right"
                >
                    <Controls className="bg-slate-800 border-slate-700" />
                    <MiniMap
                        className="bg-slate-900 border-slate-700"
                        nodeColor="#6366f1"
                    />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#475569" />
                </ReactFlow>
            </div>

            {/* Step Palette (Sidebar) */}
            <div className="absolute right-0 top-14 bottom-0 w-64 bg-slate-900/95 backdrop-blur-sm border-l border-slate-800 p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Step Palette</h3>
                <div className="space-y-2">
                    {[
                        { icon: '🌐', label: 'API Endpoint', color: 'primary' },
                        { icon: '✅', label: 'Validation', color: 'blue' },
                        { icon: '⚙️', label: 'Processing', color: 'purple' },
                        { icon: '💾', label: 'Database', color: 'green' },
                        { icon: '🤖', label: 'AI Agent', color: 'secondary' },
                        { icon: '📧', label: 'Notification', color: 'orange' },
                    ].map((step) => (
                        <div
                            key={step.label}
                            draggable
                            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-move transition-colors flex items-center gap-2"
                        >
                            <span className="text-xl">{step.icon}</span>
                            <span className="text-sm text-slate-300">{step.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-3 bg-slate-800/50 rounded-lg">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Tips</h4>
                    <ul className="text-xs text-slate-500 space-y-1">
                        <li>• Drag steps onto canvas</li>
                        <li>• Connect steps with edges</li>
                        <li>• Click to edit properties</li>
                        <li>• Generate code from workflow</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
