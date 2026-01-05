import React from "react";
import { Braces } from "lucide-react";

interface DataPopoverProps {
    data: Record<string, any> | undefined;
    type: "input" | "output";
    className?: string;
    isVisible?: boolean;
}

export const DataPopover = ({
    data,
    type,
    className,
    isVisible,
}: DataPopoverProps) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
        <div
            className={`absolute z-50 transition-all duration-200 ${className} ${
                isVisible
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ width: "280px" }}
        >
            <div className="bg-slate-800 text-slate-200 rounded-lg shadow-xl border border-slate-700 overflow-hidden text-xs">
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                    <Braces className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                        {type === "input" ? "Inputs" : "Outputs"}
                    </span>
                </div>
                <div className="p-3 bg-slate-800 max-h-60 overflow-y-auto">
                    <pre className="font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
            {/* Arrow */}
            <div
                className={`absolute w-3 h-3 bg-slate-900 rotate-45 transform border border-slate-700 
            ${
                type === "input"
                    ? "-bottom-1.5 left-4 border-t-0 border-l-0"
                    : "-top-1.5 right-4 border-b-0 border-r-0"
            }
       `}
            />
        </div>
    );
};
