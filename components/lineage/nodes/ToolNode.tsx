import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Wrench, Database, Server } from "lucide-react";
import clsx from "clsx";
import { ToolNodeData } from "@/types/lineage";

const ToolNode = ({ data, selected }: NodeProps<ToolNodeData>) => {
    // Select icon based on tool name or defaults
    const getIcon = () => {
        const name = data.toolName?.toLowerCase() || "";
        if (name.includes("db") || name.includes("database"))
            return <Database size={16} className="text-slate-600" />;
        if (name.includes("api") || name.includes("service"))
            return <Server size={16} className="text-slate-600" />;
        return <Wrench size={16} className="text-slate-600" />;
    };

    return (
        <div className="relative group">
            <div
                className={clsx(
                    "min-w-[200px] max-w-[240px] bg-white border border-slate-200 rounded-md shadow-sm transition-all duration-200",
                    "hover:shadow-md hover:border-slate-400",
                    selected
                        ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                )}
            >
                {/* Header */}
                <div className="p-3 flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                        {getIcon()}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            TOOL
                        </div>
                        <div className="text-xs font-semibold text-slate-900 truncate">
                            {data.toolName}
                        </div>
                    </div>
                </div>

                {/* Handles */}
                {/* Input from Agent */}
                <Handle
                    type="target"
                    position={Position.Top}
                    id="top"
                    className="!w-2 !h-2 !border-white !border-2 !bg-slate-400 hover:!bg-blue-500"
                    style={{ left: "40%" }}
                />

                {/* Output to Agent */}
                <Handle
                    type="source"
                    position={Position.Top}
                    id="top-out"
                    className="!w-2 !h-2 !border-white !border-2 !bg-slate-400 hover:!bg-blue-500"
                    style={{ left: "60%" }}
                />
            </div>
        </div>
    );
};

export default memo(ToolNode);
