import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Square } from "lucide-react";

const EndNode = () => {
    return (
        <div className="relative group">
            {/* Use a Red/Slate color to signify Stop/End */}
            <div className="relative flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full border-4 border-slate-200 shadow-md transition-transform group-hover:scale-105">
                <Square className="w-4 h-4 text-white fill-white" />
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    End
                </span>
            </div>

            <Handle
                id="left"
                type="target"
                position={Position.Left}
                className="!w-2.5 !h-2.5 !border-2 !bg-slate-800 !border-white !shadow-sm"
            />
        </div>
    );
};

export default memo(EndNode);
