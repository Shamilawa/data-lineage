import React, { useState } from "react";
import { X, Clock, Database, ArrowRight, BrainCircuit } from "lucide-react";
import { getStatusBadgeStyles } from "@/utils/node-styling";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utils
import { LineageNode, LineageEdge } from "@/types/lineage";

interface InspectorPanelProps {
    selectedItem: LineageNode | LineageEdge | null;
    onClose: () => void;
}

const InspectorPanel = ({ selectedItem, onClose }: InspectorPanelProps) => {
    if (!selectedItem) return null;

    // Determine type (Node or Edge)
    const isNode = "data" in selectedItem && "position" in selectedItem;
    const isEdge = "source" in selectedItem && "target" in selectedItem;

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
                                Data Payload
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
                {isEdge && <EdgeContent edge={selectedItem as LineageEdge} />}
            </div>
        </div>
    );
};

// --- Sub-components for Content ---

const NodeContent = ({ node }: { node: LineageNode }) => {
    const data = node.data;
    const [activeTab, setActiveTab] = useState<"overview" | "data">("overview");

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
                        <div className="space-y-4">
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
                        </div>
                    )}

                    {activeTab === "data" && (
                        <div className="space-y-6">
                            {isLLM && (data as any).history ? (
                                <LLMInteractionAccordion
                                    history={(data as any).history}
                                />
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                                            <ArrowRight className="w-3 h-3 text-blue-500" />
                                            Input Data
                                        </h3>
                                        <pre className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-600 overflow-auto max-h-[400px]">
                                            {JSON.stringify(
                                                data.inputs,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                                            <ArrowRight className="w-3 h-3 text-emerald-500" />
                                            Output Data
                                        </h3>
                                        <pre className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-600 overflow-auto max-h-[400px]">
                                            {JSON.stringify(
                                                data.outputs,
                                                null,
                                                2
                                            )}
                                        </pre>
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

const LLMInteractionAccordion = ({ history }: { history: any[] }) => {
    // Group by source (Agent Name)
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-3">
            {history.map((interaction, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div
                        key={idx}
                        className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200"
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 text-left transition-colors",
                                isOpen
                                    ? "bg-slate-50"
                                    : "bg-white hover:bg-slate-50"
                            )}
                        >
                            <span className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-blue-500" />
                                Interaction with: {interaction.source}
                            </span>
                            <span
                                className={cn(
                                    "p-1 rounded-full text-slate-400 transition-transform duration-200",
                                    isOpen ? "rotate-90" : "rotate-0"
                                )}
                            >
                                <ArrowRight className="w-3 h-3" />
                            </span>
                        </button>

                        {isOpen && (
                            <div className="p-3 bg-white border-t border-slate-100 space-y-4 animate-in slide-in-from-top-1 duration-200">
                                {/* Input Section */}
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3 text-blue-500" />
                                        Input (Step {interaction.requestStep})
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded p-2 text-xs font-mono text-slate-600 overflow-x-auto">
                                        {typeof interaction.prompt ===
                                        "object" ? (
                                            <pre>
                                                {JSON.stringify(
                                                    interaction.prompt,
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        ) : (
                                            interaction.prompt
                                        )}
                                    </div>
                                </div>

                                {/* Output Section */}
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                                        Output (Step {interaction.responseStep})
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded p-2 text-xs font-mono text-slate-600 overflow-x-auto">
                                        {typeof interaction.response ===
                                        "object" ? (
                                            <pre>
                                                {JSON.stringify(
                                                    interaction.response,
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        ) : (
                                            interaction.response
                                        )}
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

const EdgeContent = ({ edge }: { edge: LineageEdge }) => {
    return (
        <div className="p-4 space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">
                        Payload Data
                    </span>
                </div>
                <pre className="text-[10px] text-slate-500 font-mono overflow-auto max-h-[400px]">
                    {JSON.stringify(edge.data?.payload || {}, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default InspectorPanel;
