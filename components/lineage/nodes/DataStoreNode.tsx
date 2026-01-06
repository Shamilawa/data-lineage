import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Database, FileJson, Server } from "lucide-react";
import clsx from "clsx";
import { ToolNodeData } from "@/types/lineage"; // Reusing ToolNodeData as base

// Custom type for DataStore if needed, otherwise ToolNodeData fits well
// (label, description, toolName -> type)

const DataStoreNode = ({ data, selected }: NodeProps<ToolNodeData>) => {
    // Determine icon based on "toolName" or metadata (e.g. Postgres vs Vector vs API)
    const getIcon = () => {
        const name = (data.toolName || "").toLowerCase();
        if (name.includes("vector") || name.includes("embedding"))
            return <FileJson className="w-4 h-4 text-purple-600" />;
        if (name.includes("api") || name.includes("feed"))
            return <Server className="w-4 h-4 text-indigo-600" />;
        return <Database className="w-4 h-4 text-emerald-600" />;
    };

    const getTheme = () => {
        const name = (data.toolName || "").toLowerCase();
        if (name.includes("vector"))
            return "bg-purple-50 border-purple-200 ring-purple-500";
        if (name.includes("api") || name.includes("feed"))
            return "bg-indigo-50 border-indigo-200 ring-indigo-500";
        return "bg-emerald-50 border-emerald-200 ring-emerald-500";
    };

    return (
        <div
            className={clsx(
                "relative min-w-[200px] px-3 py-2.5 rounded-lg border shadow-sm transition-all",
                getTheme(),
                selected && "ring-2 ring-offset-1 shadow-md"
            )}
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-white/60 border border-black/5 shadow-sm">
                    {getIcon()}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold opacity-60 leading-none">
                        Data Store
                    </span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                        {data.label}
                    </span>
                </div>
            </div>

            <div className="text-[10px] text-slate-600 opacity-80 leading-snug pl-1 border-l-2 border-black/5">
                {data.description}
            </div>

            {/* Handles - Usually Data Stores are Tools (Input/Output) */}

            {/* Left: Writing to DB */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                className="!w-2 !h-2 !bg-slate-400 hover:!bg-slate-600"
            />

            {/* Right: Reading from DB */}
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="!w-2 !h-2 !bg-slate-400 hover:!bg-slate-600"
            />

            {/* Top/Bottom for more complex flows */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-2 !h-2 !bg-slate-400 hover:!bg-slate-600"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-2 !h-2 !bg-slate-400 hover:!bg-slate-600"
            />
        </div>
    );
};

export default memo(DataStoreNode);
