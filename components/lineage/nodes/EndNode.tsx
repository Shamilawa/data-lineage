import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Square } from "lucide-react";
import clsx from "clsx";

const EndNode = () => {
    return (
        <div className="relative group">
            {/* Use a Red/Slate color to signify Stop/End */}
            <div
                className={clsx(
                    "px-3 py-1.5 bg-slate-900 border-2 border-slate-800 rounded-md shadow-sm transition-all duration-200",
                    "hover:shadow-md hover:bg-slate-800 flex items-center gap-2"
                )}
            >
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center border border-slate-700">
                    <Square className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wide">
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
