import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { BrainCircuit } from "lucide-react";
import clsx from "clsx";
import { LLMNodeData } from "@/types/lineage";

const LLMNode = ({ data, selected }: NodeProps<LLMNodeData>) => {
    return (
        <div className="relative group">
            <div
                className={clsx(
                    "w-[280px] bg-white border-2 border-cyan-200 rounded-md shadow-sm transition-all duration-200",
                    "hover:shadow-md hover:border-cyan-400"
                )}
            >
                {/* Header */}
                <div className="p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-cyan-50 flex items-center justify-center border border-cyan-100">
                        <BrainCircuit className="w-5 h-5 text-cyan-700" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-slate-900 truncate">
                                {data.label}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                                {data.model}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Handles - Standard Sequence Only */}
                {/* Target (Top) - Orthogonal Input */}
                <Handle
                    id="top"
                    type="target"
                    position={Position.Top}
                    className="!w-2 !h-2 !bg-cyan-500 !border-white !border-2 -mt-[1px]"
                />

                {/* Source (Top) - Orthogonal Output (Offset) */}
                <Handle
                    id="top-out"
                    type="source"
                    position={Position.Top}
                    className="!w-2 !h-2 !border-white !border-2 -mt-[1px]"
                    style={{ left: "75%", background: "#0e7490" }} // Cyan-700
                />
            </div>
        </div>
    );
};

export default memo(LLMNode);
