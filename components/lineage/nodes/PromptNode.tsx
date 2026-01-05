import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { FileText } from "lucide-react";
import clsx from "clsx";
import { PromptNodeData } from "@/types/lineage";

const PromptNode = ({ data, selected }: NodeProps<PromptNodeData>) => {
    return (
        <div
            className={clsx(
                "relative min-w-[180px] bg-white rounded-lg transition-all duration-200",
                "border px-3 py-2.5",
                selected
                    ? "border-amber-400 shadow-md ring-1 ring-amber-400"
                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="bg-amber-50 p-1.5 rounded-md border border-amber-100">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                        Template
                    </div>
                    <div
                        className="text-xs font-semibold text-slate-700 truncate"
                        title={data.label}
                    >
                        {data.label}
                    </div>
                </div>
            </div>

            {/* Handles */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-2 !h-2 !bg-amber-300 !border-amber-500"
            />
        </div>
    );
};

export default memo(PromptNode);
