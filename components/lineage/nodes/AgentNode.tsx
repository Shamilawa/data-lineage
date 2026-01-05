import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Bot, Activity } from "lucide-react";
import clsx from "clsx";
import { AgentNodeData } from "@/types/lineage";

const AgentNode = ({ data, selected }: NodeProps<AgentNodeData>) => {
    return (
        <div
            className={clsx(
                "relative min-w-[240px] bg-white rounded-lg transition-all duration-200",
                "border px-4 py-3",
                selected
                    ? "border-blue-500 shadow-md ring-1 ring-blue-500"
                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
            )}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded-md border border-blue-100">
                        <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Agent
                    </span>
                </div>
                {data.agentType && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200">
                        {data.agentType}
                    </span>
                )}
            </div>

            <div className="font-bold text-slate-800 text-sm mb-3">
                {data.label}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {data.status === "active" ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Active
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        Idle
                    </div>
                )}

                {data.duration && (
                    <div className="ml-auto text-[10px] font-mono text-slate-400 flex items-center gap-1">
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
