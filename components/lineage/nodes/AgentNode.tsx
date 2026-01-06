import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Bot, Activity, BrainCircuit } from "lucide-react";
import clsx from "clsx";
import { AgentNodeData } from "@/types/lineage";
import {
    getNodeStatusStyles,
    getStatusBadgeStyles,
    getStatusLabel,
} from "@/utils/node-styling";

const AgentNode = ({ data, selected }: NodeProps<AgentNodeData>) => {
    // Detect "Brain" usage
    const hasBrainAccess =
        data.agentType === "Reasoning" ||
        data.xaiTimeline?.some((t) => t.type === "llm") ||
        data.interactions?.some(
            (i) =>
                i.inputSummary?.toLowerCase().includes("llm") ||
                i.title.includes("LLM")
        );

    return (
        <div
            className={clsx(
                "relative min-w-[240px] px-4 py-3",
                getNodeStatusStyles(data.status),
                selected && "ring-2 ring-offset-1 ring-blue-500"
            )}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded-md border border-blue-100">
                        <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">
                        Agent
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {hasBrainAccess && (
                        <div
                            className="p-1 rounded bg-purple-100 border border-purple-200 text-purple-600"
                            title="Connected to Shared Brain (LLM)"
                        >
                            <BrainCircuit className="w-3.5 h-3.5" />
                        </div>
                    )}
                    {data.agentType && (
                        <span className="px-2 py-0.5 rounded bg-white/50 text-[10px] font-medium border border-black/5">
                            {data.agentType}
                        </span>
                    )}
                </div>
            </div>

            <div className="font-bold text-sm mb-3 opacity-90">
                {data.label}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                <div
                    className={clsx(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded border border-black/5",
                        getStatusBadgeStyles(data.status)
                    )}
                >
                    {data.status === "active" || data.status === "failure" ? (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                        </span>
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                    )}
                    {getStatusLabel(data.status)}
                </div>

                {data.duration && (
                    <div className="ml-auto text-[10px] font-mono opacity-60 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {data.duration}
                    </div>
                )}
            </div>

            {/* Handles */}
            {/* Main Sequence: Left (In) -> Right (Out) */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white hover:!bg-blue-500 transition-colors"
                style={{ left: -6 }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="!w-2.5 !h-2.5 !bg-slate-400 !border-white !border-2 hover:!bg-blue-500 transition-colors"
                style={{ right: -6 }}
            />

            {/* Vertical Context: Top (In from Prompt) | Bottom (Out to Tools/LLM) */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white hover:!bg-blue-500 transition-colors"
                style={{ top: -6 }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-2.5 !h-2.5 !bg-slate-400 !border-white !border-2 hover:!bg-blue-500 transition-colors"
                style={{ bottom: -6 }}
            />
        </div>
    );
};

export default memo(AgentNode);
