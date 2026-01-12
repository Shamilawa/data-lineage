"use client";

import React from "react";
import {
    Database,
    ArrowRight,
    ChevronRight,
    Activity,
    Box,
    Cpu,
    Zap,
    MessageSquare,
} from "lucide-react";
import { LineageEdge, LineageNode } from "@/types/lineage";
import { cn } from "@/lib/utils";

interface EdgeInspectorPanelProps {
    edge: LineageEdge;
    sourceNode?: LineageNode;
    targetNode?: LineageNode;
}

// Helper to get node icons
const getNodeIcon = (type?: string) => {
    switch (type) {
        case "agent":
            return <Cpu className="w-3.5 h-3.5" />;
        case "llm":
            return <Zap className="w-3.5 h-3.5" />;
        case "tool":
            return <Box className="w-3.5 h-3.5" />;
        case "prompt":
            return <MessageSquare className="w-3.5 h-3.5" />;
        case "start":
            return <Activity className="w-3.5 h-3.5" />;
        case "end":
            return <Activity className="w-3.5 h-3.5" />;
        default:
            return <Database className="w-3.5 h-3.5" />;
    }
};

const formatJson = (data: any) => {
    try {
        return JSON.stringify(data, null, 2);
    } catch (e) {
        return String(data);
    }
};

const EdgeInspectorPanel = ({
    edge,
    sourceNode,
    targetNode,
}: EdgeInspectorPanelProps) => {
    return (
        <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Connection History / Flow Indicator */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    Data Transfer Flow
                </div>

                <div className="flex items-center justify-between gap-3">
                    {/* Source Node Summary */}
                    <div className="flex-1 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1 bg-blue-50 text-blue-600 rounded">
                                {getNodeIcon(sourceNode?.type)}
                            </div>
                            <span className="text-xs font-bold text-slate-800 truncate">
                                {sourceNode?.data?.label || "Unknown Source"}
                            </span>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase font-medium">
                            {sourceNode?.type || "Unknown Type"}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                        <div className="h-4 w-px bg-slate-100" />
                    </div>

                    {/* Target Node Summary */}
                    <div className="flex-1 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1 bg-emerald-50 text-emerald-600 rounded">
                                {getNodeIcon(targetNode?.type)}
                            </div>
                            <span className="text-xs font-bold text-slate-800 truncate">
                                {targetNode?.data?.label || "Unknown Target"}
                            </span>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase font-medium">
                            {targetNode?.type || "Unknown Type"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payload Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2 tracking-wider">
                        <Database className="w-3 h-3 text-blue-500" />
                        Transferred Payload
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        JSON
                    </span>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[500px] shadow-inner custom-scrollbar">
                        {formatJson(edge.data?.payload || {})}
                    </pre>
                </div>
            </div>

            {/* Relationship Info */}
            <div className="pt-4 border-t border-slate-100 hidden">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md mt-0.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-blue-900">
                            Connection Link
                        </div>
                        <p className="text-[11px] text-blue-700 leading-normal mt-0.5">
                            This edge represents a data dependency where output
                            from{" "}
                            <span className="font-semibold">
                                {sourceNode?.data?.label}
                            </span>{" "}
                            is passed to{" "}
                            <span className="font-semibold">
                                {targetNode?.data?.label}
                            </span>{" "}
                            for processing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EdgeInspectorPanel;
