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
            return <Database size={16} className="text-blue-600" />;
        if (name.includes("api") || name.includes("service"))
            return <Server size={16} className="text-blue-600" />;
        return <Wrench size={16} className="text-blue-600" />;
    };

    return (
        <div
            className={clsx(
                "w-[240px] rounded-lg border-2 bg-white p-3 shadow-sm transition-all duration-200",
                selected
                    ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                    : "border-slate-200 hover:border-blue-300"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
                    {getIcon()}
                </div>
                <div className="flex-1 overflow-hidden">
                    <h3 className="truncate text-xs font-bold uppercase tracking-wider text-slate-500">
                        Tool
                    </h3>
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {data.toolName}
                    </p>
                </div>
            </div>

            {/* Handles */}
            {/* Top Handles for Agent Interaction (Agent is above) */}

            {/* Input from Agent */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="h-2.5! w-2.5! border-2! border-white! bg-slate-400! hover:bg-blue-500!"
                style={{ left: "40%" }}
            />

            {/* Output to Agent */}
            <Handle
                type="source"
                position={Position.Top}
                id="top-out"
                className="h-2.5! w-2.5! border-2! border-white! bg-slate-400! hover:bg-blue-500!"
                style={{ left: "60%" }}
            />
        </div>
    );
};

export default memo(ToolNode);
