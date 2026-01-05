import React from "react";
import { X, Clock, CheckCircle2, AlertCircle, Terminal } from "lucide-react";
import { LineageNode } from "@/types/lineage";
import clsx from "clsx";

interface DetailsPanelProps {
    node: LineageNode | null;
    onClose: () => void;
}

const JsonViewer = ({
    data,
    label,
}: {
    data?: Record<string, any>;
    label: string;
}) => {
    if (!data) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                {label}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 overflow-x-auto">
                <pre className="text-xs font-mono text-slate-700 leading-relaxed">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export const DetailsPanel = ({ node, onClose }: DetailsPanelProps) => {
    if (!node) return null;

    const {
        label,
        status,
        duration,
        timestamp,
        inputs,
        outputs,
        ...otherData
    } = node.data;

    // Filter out internal UI fields for the "Metadata" section if needed
    const metadata = { ...otherData };

    return (
        <div className="absolute top-4 right-4 bottom-4 w-96 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-right-4 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                        {label}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        {status === "success" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" /> Success
                            </span>
                        )}
                        {status === "active" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                <Clock className="w-3 h-3 animate-pulse" />{" "}
                                Running
                            </span>
                        )}
                        {timestamp && (
                            <span className="text-xs text-slate-400 font-mono">
                                {timestamp}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
                {/* Metadata Grid */}
                {(duration || Object.keys(metadata).length > 0) && (
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                        {duration && (
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                                    Duration
                                </div>
                                <div className="text-sm font-medium text-slate-700">
                                    {duration}
                                </div>
                            </div>
                        )}
                        {Object.entries(metadata).map(([key, value]) => (
                            <div key={key}>
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                                    {key}
                                </div>
                                <div
                                    className="text-sm font-medium text-slate-700 truncate"
                                    title={String(value)}
                                >
                                    {String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Data Payloads */}
                <div className="space-y-6">
                    <JsonViewer data={inputs} label="Inputs" />

                    {/* Divider arrow */}
                    {inputs && outputs && (
                        <div className="flex justify-center text-slate-300">
                            ⬇
                        </div>
                    )}

                    <JsonViewer data={outputs} label="Outputs" />
                </div>
            </div>
        </div>
    );
};
