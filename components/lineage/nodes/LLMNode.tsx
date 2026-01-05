import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { BrainCircuit } from "lucide-react";
import clsx from "clsx";
import { LLMNodeData } from "@/types/lineage";

const LLMNode = ({ data, selected }: NodeProps<LLMNodeData>) => {
    return (
        <div
            className={clsx(
                "relative min-w-[200px] bg-white rounded-lg transition-all duration-200",
                "border px-3 py-3",
                selected
                    ? "border-purple-500 shadow-md ring-1 ring-purple-500"
                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
            )}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-50 p-1.5 rounded-md border border-purple-100">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        LLM Resource
                    </div>
                    <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 inline-block mt-0.5">
                        {data.model}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-50 mt-2">
                {data.tokens && <span>Tokens: {data.tokens}</span>}
                {data.cost && <span>Cost: ${data.cost}</span>}
            </div>

            {/* Handles */}

            {/* Input from Agent */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-2 !h-2 !bg-purple-400 !border-white !border-2"
                style={{ left: "40%" }}
            />

            {/* Output to Agent */}
            <Handle
                type="source"
                position={Position.Top}
                id="top-out"
                className="!w-2 !h-2 !bg-purple-400 !border-white !border-2"
                style={{ left: "60%" }}
            />
        </div>
    );
};

export default memo(LLMNode);
