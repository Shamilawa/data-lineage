import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { UserCog, Activity } from "lucide-react";
import clsx from "clsx";
import { AgentNodeData } from "@/types/lineage";
import {
    getNodeStatusStyles,
    getStatusBadgeStyles,
    getStatusLabel,
} from "@/utils/node-styling";

const SupervisorNode = ({ data, selected }: NodeProps<AgentNodeData>) => {
    return (
        <div
            className={clsx(
                "relative min-w-[260px] px-4 py-3 rounded-xl border-2 shadow-lg transition-all",
                // Custom styles for Supervisor: Gold/Amber theme
                "bg-amber-50 border-amber-200",
                selected && "ring-2 ring-offset-2 ring-amber-500 shadow-xl"
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 border-b border-amber-200/50 pb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-100 p-1.5 rounded-lg border border-amber-200 shadow-sm">
                        <UserCog className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block leading-none mb-0.5">
                            Supervisor
                        </span>
                        <span className="text-xs font-semibold text-amber-900/80">
                            Orchestrator
                        </span>
                    </div>
                </div>
                {/* Status Indicator */}
                <div
                    className={clsx(
                        "w-2 h-2 rounded-full",
                        data.status === "active"
                            ? "bg-amber-500 animate-pulse"
                            : data.status === "success"
                            ? "bg-green-500"
                            : "bg-slate-300"
                    )}
                />
            </div>

            {/* Content */}
            <div className="font-bold text-sm text-slate-800 mb-2 leading-tight">
                {data.label}
            </div>

            <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {data.description || "Orchestrates workflow execution."}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-amber-200/50">
                <div
                    className={clsx(
                        "flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        getStatusBadgeStyles(data.status)
                    )}
                >
                    {getStatusLabel(data.status)}
                </div>

                {data.duration && (
                    <div className="ml-auto text-[10px] font-mono text-amber-800/60 flex items-center gap-1 bg-amber-100/50 px-1.5 py-0.5 rounded">
                        <Activity className="w-3 h-3" />
                        {data.duration}
                    </div>
                )}
            </div>

            {/* Handles - Similar layout to Agents for consistency */}

            {/* Left: Input from Previous Step / User */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white hover:!bg-amber-600 transition-colors shadow-sm"
            />

            {/* Right: Output to Next Step */}
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white hover:!bg-amber-600 transition-colors shadow-sm"
            />

            {/* Bottom: Delegation to Agents/Tools */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white hover:!bg-amber-600 transition-colors shadow-sm"
            />

            {/* Top: Feedback/Result from Agents */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white hover:!bg-amber-600 transition-colors shadow-sm"
            />
        </div>
    );
};

export default memo(SupervisorNode);
