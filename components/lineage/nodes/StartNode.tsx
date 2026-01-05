import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Play } from "lucide-react";

const StartNode = () => {
    return (
        <div className="relative group">
            <div className="relative flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full border-4 border-emerald-100 shadow-md transition-transform group-hover:scale-105">
                <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
