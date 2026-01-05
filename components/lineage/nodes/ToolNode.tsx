import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Wrench, Database, Server } from "lucide-react";
import clsx from "clsx";
import { ToolNodeData } from "@/types/lineage";
import { getNodeStatusStyles } from "@/utils/node-styling";

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
                    "min-w-[200px] max-w-[240px]",
                    getNodeStatusStyles(data.status),
                    selected && "ring-2 ring-offset-1 ring-blue-500"
                )}
            >
                {/* Header */}
                <div className="p-3 flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                        {getIcon()}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-0.5">
                            TOOL
                        </div>
                        <div className="text-xs font-semibold opacity-90 truncate">
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
