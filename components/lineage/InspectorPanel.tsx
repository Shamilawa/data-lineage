import React, { useState } from "react";
import {
    X,
    Clock,
    Database,
    BrainCircuit,
    Activity,
    ChevronDown,
    ChevronRight,
    ArrowRight,
} from "lucide-react";
import { getStatusBadgeStyles } from "@/utils/node-styling";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utils
import { LineageNode, LineageEdge } from "@/types/lineage";

import EdgeInspectorPanel from "./EdgeInspectorPanel";

interface InspectorPanelProps {
    selectedItem: LineageNode | LineageEdge | null;
    nodes: LineageNode[];
    onClose: () => void;
}

// Helper for safe JSON rendering
const formatJson = (data: any) => {
    try {
        return JSON.stringify(data, null, 2);
    } catch (e) {
        return String(data);
    }
};

const InspectorPanel = ({
    selectedItem,
    nodes,
    onClose,
}: InspectorPanelProps) => {
    if (!selectedItem) return null;

    // Determine type (Node or Edge)
    const isNode = "data" in selectedItem && "position" in selectedItem;
    const isEdge = "source" in selectedItem && "target" in selectedItem;

    // If it's an edge, find the source and target nodes for context
    let sourceNode: LineageNode | undefined;
    let targetNode: LineageNode | undefined;

    if (isEdge) {
        const edge = selectedItem as LineageEdge;
        sourceNode = nodes.find((n) => n.id === edge.source);
        targetNode = nodes.find((n) => n.id === edge.target);
    }

    return (
        <div className="absolute right-0 top-0 h-full w-[450px] bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        {isNode ? (
                            <>
                                <span>
                                    {(selectedItem as LineageNode).data.label}
                                </span>
                                {(selectedItem as LineageNode).data.status && (
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase ring-1 ring-inset",
                                            getStatusBadgeStyles(
                                                (selectedItem as LineageNode)
                                                    .data.status
                                            )
                                        )}
                                    >
                                        {
                                            (selectedItem as LineageNode).data
                                                .status
                                        }
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                Edge Connection
                            </span>
                        )}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        ID: {selectedItem.id}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {isNode && <NodeContent node={selectedItem as LineageNode} />}
                {isEdge && (
                    <EdgeInspectorPanel
                        edge={selectedItem as LineageEdge}
                        sourceNode={sourceNode}
                        targetNode={targetNode}
                    />
                )}
            </div>
        </div>
    );
};

// --- Sub-components for Content ---

const NodeContent = ({ node }: { node: LineageNode }) => {
    const data = node.data;
    const [activeTab, setActiveTab] = useState<"overview" | "data">("overview");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);

    const isLLM = node.type === "llm" && "history" in data && data.history;

    return (
        <div className="p-0">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-100">
                <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                        Type
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                        {node.type?.toUpperCase()}
                    </div>
                </div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                        {isLLM ? "Model" : "Duration"}
                    </div>
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        {isLLM ? (
                            <BrainCircuit className="w-3 h-3 text-cyan-600" />
                        ) : (
                            <Clock className="w-3 h-3 text-slate-400" />
                        )}
                        {isLLM
                            ? (data as any).model || "Unknown"
                            : data.duration || "N/A"}
                    </div>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="w-full">
                <div className="flex border-b border-slate-100">
                    {(["overview", "data"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors",
                                activeTab === tab
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="p-4">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {data.description ? (
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                                        Description
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
                                        {data.description}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    No description available.
                                </p>
                            )}

                            {/* xAI Interaction Timeline Feature */}
                            {(data as any).xaiTimeline && (
                                <div className="pt-2 border-t border-slate-100">
                                    {!showTimeline && !isGenerating ? (
                                        <button
                                            onClick={() => {
                                                setIsGenerating(true);
                                                setTimeout(() => {
                                                    setIsGenerating(false);
                                                    setShowTimeline(true);
                                                }, 1500);
                                            }}
                                            className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Activity className="w-4 h-4 text-blue-600" />
                                            Generate Interaction Analysis
                                        </button>
                                    ) : isGenerating ? (
                                        <div className="flex flex-col items-center justify-center py-8 space-y-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-xs text-slate-500 font-medium">
                                                Analyzing agent decision path...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-xs uppercase text-slate-500 flex items-center gap-2 tracking-wider">
                                                    <Activity className="w-3 h-3" />
                                                    Interaction Timeline
                                                </h3>
                                                <button
                                                    onClick={() =>
                                                        setShowTimeline(false)
                                                    }
                                                    className="text-xs text-slate-400 hover:text-slate-600"
                                                >
                                                    Reset
                                                </button>
                                            </div>

                                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                                {(
                                                    (data as any)
                                                        .xaiTimeline as any[]
                                                ).map((event, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative"
                                                    >
                                                        {/* Timeline Dot */}
                                                        <div
                                                            className={cn(
                                                                "absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-white",
                                                                event.type ===
                                                                    "input"
                                                                    ? "border-blue-500 ring-2 ring-blue-50"
                                                                    : event.type ===
                                                                      "llm"
                                                                    ? "border-indigo-500 ring-2 ring-indigo-50"
                                                                    : event.type ===
                                                                      "tool"
                                                                    ? "border-slate-500 ring-2 ring-slate-50"
                                                                    : event.type ===
                                                                      "output"
                                                                    ? "border-emerald-500 ring-2 ring-emerald-50"
                                                                    : "border-slate-400"
                                                            )}
                                                        />

                                                        <div className="bg-white rounded pl-4 pb-6 border-l border-slate-100 ml-px">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span
                                                                    className={cn(
                                                                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                                        event.type ===
                                                                            "input"
                                                                            ? "bg-blue-50 text-blue-700"
                                                                            : event.type ===
                                                                              "llm"
                                                                            ? "bg-indigo-50 text-indigo-700"
                                                                            : event.type ===
                                                                              "tool"
                                                                            ? "bg-slate-100 text-slate-700"
                                                                            : event.type ===
                                                                              "output"
                                                                            ? "bg-emerald-50 text-emerald-700"
                                                                            : "text-slate-500"
                                                                    )}
                                                                >
                                                                    {event.type}
                                                                </span>
                                                                <span className="text-xs font-semibold text-slate-900">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 leading-normal pl-1">
                                                                {event.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "data" && (
                        <div className="space-y-6">
                            {/* Prefer "interactions" array (Accordion View) */}
                            {(data as any).interactions ? (
                                <NodeInteractionAccordion
                                    interactions={(data as any).interactions}
                                />
                            ) : isLLM ? (
                                /* Fallback for legacy LLM history if needed, or map it to interactions */
                                <NodeInteractionAccordion
                                    interactions={(data as any).history.map(
                                        (h: any) => ({
                                            title: `Interaction with: ${
                                                h.source || "Unknown"
                                            }`,
                                            input: h.prompt,
                                            output: h.response,
                                        })
                                    )}
                                />
                            ) : (
                                /* Standard Stacked View for Simple Nodes */
                                <>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                                                <Database className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                                                Input Data
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 font-mono text-xs text-slate-700 overflow-x-auto max-h-[300px]">
                                            <pre>{formatJson(data.inputs)}</pre>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-emerald-50 rounded text-emerald-600">
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                                                Output Data
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 font-mono text-xs text-slate-700 overflow-x-auto max-h-[300px]">
                                            <pre>
                                                {formatJson(data.outputs)}
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Reusable Content Components ---

// Grouped Accordion for Node Interactions (Agents & LLMs)
const NodeInteractionAccordion = ({
    interactions,
}: {
    interactions: { title: string; input: any; output: any }[];
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {interactions.map((interaction, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300"
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className={cn(
                                "w-full px-4 py-3 flex items-center justify-between text-left transition-colors",
                                isOpen
                                    ? "bg-slate-50 border-b border-slate-100"
                                    : "hover:bg-slate-50"
                            )}
                        >
                            <span className="font-semibold text-sm text-slate-800">
                                {interaction.title}
                            </span>
                            {isOpen ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="divide-y divide-slate-100 animate-in slide-in-from-top-2 duration-200">
                                <div className="p-3 bg-slate-50/50">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                        <ArrowRight className="w-3 h-3" />
                                        Input Payload
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded p-2 overflow-x-auto">
                                        <pre className="text-[11px] text-slate-600 font-mono leading-relaxed">
                                            {formatJson(interaction.input)}
                                        </pre>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50/50">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                        <ArrowRight className="w-3 h-3 rotate-180" />
                                        Output Response
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded p-2 overflow-x-auto">
                                        <pre className="text-[11px] text-slate-600 font-mono leading-relaxed">
                                            {formatJson(interaction.output)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default InspectorPanel;
