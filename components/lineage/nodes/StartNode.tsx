import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Play } from "lucide-react";

const StartNode = () => {
    return (
        <div className="relative group">
            <div className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-400 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Play className="w-3 h-3 text-emerald-600 ml-0.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Start
                </span>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="!w-2.5 !h-2.5 !bg-emerald-500 !border-white !border-2 !shadow-sm hover:!bg-emerald-400 hover:!w-3 hover:!h-3 transition-all"
            />
        </div>
    );
};

export default memo(StartNode);
