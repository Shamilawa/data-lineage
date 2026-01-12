// --- Agent Reasoning Simulation Component ---

/*
  This component manages the step-by-step reveal of the agent's reasoning process.
  Steps:
  1. Context (Input)
  2. Reasoning (Text typewriter effect)
  3. Action Plan (Interactions)
  4. Outcome (Output)
*/

import { useEffect, useState } from "react";
import {
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    Database,
    Layers,
    Play,
    RefreshCcw,
    Activity,
    ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AgentReasoningSimulation = ({
    reasoning,
    inputs,
    outputs,
    interactions,
    onReset,
}: {
    reasoning: string;
    inputs: any;
    outputs: any;
    interactions: any[];
    onReset: () => void;
}) => {
    const [step, setStep] = useState(0); // 0: Start, 1: Context, 2: Reasoning, 3: Actions, 4: Output
    const [displayedText, setDisplayedText] = useState("");

    // Simulate the sequence
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (step === 0) {
            timeout = setTimeout(() => setStep(1), 500);
        } else if (step === 1) {
            timeout = setTimeout(() => setStep(2), 1500); // Show context for 1.5s then start reasoning
        } else if (step === 2) {
            // Typewriter effect handling is below, after it finishes it sets step 3
        } else if (step === 3) {
            timeout = setTimeout(() => setStep(4), 2000); // Show actions for 2s then show output
        }
        return () => clearTimeout(timeout);
    }, [step]);

    // Typewriter effect for Reasoning (Step 2)
    useEffect(() => {
        if (step === 2) {
            let i = 0;
            const speed = 10; // ms per char
            const type = () => {
                if (i < reasoning.length) {
                    setDisplayedText(reasoning.slice(0, i + 1));
                    i++;
                    setTimeout(type, speed);
                } else {
                    // Finished typing, wait a bit then move to next step
                    setTimeout(() => setStep(3), 1000);
                }
            };
            type();
        }
    }, [step, reasoning]);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "p-1.5 rounded-md transition-colors",
                            step >= 4
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                        )}
                    >
                        {step >= 4 ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Activity className="w-4 h-4 animate-pulse" />
                        )}
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        {step === 1 && "Analyzing Input..."}
                        {step === 2 && "Formulating Plan..."}
                        {step === 3 && "Executing Actions..."}
                        {step === 4 && "Process Complete"}
                    </span>
                </div>
                <button
                    onClick={onReset}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <RefreshCcw className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="space-y-3 relative">
                {/* Step 1: Input Context */}
                <div
                    className={cn(
                        "transition-all duration-500",
                        step >= 1
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2"
                    )}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <Database className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                            Context Trigger
                        </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-600 font-mono line-clamp-2">
                        {/* Try to show a summary if available in inputs, or just raw JSON snippet */}
                        {inputs ? (
                            JSON.stringify(inputs).slice(0, 100) +
                            (JSON.stringify(inputs).length > 100 ? "..." : "")
                        ) : (
                            <span className="text-slate-400 italic">
                                No input data available
                            </span>
                        )}
                    </div>
                </div>

                {/* Step 2: Reasoning (The Core) */}
                {step >= 2 && (
                    <div className="transition-all duration-500 animate-in fade-in">
                        <div className="flex items-center gap-2 mb-1">
                            <BrainCircuit className="w-3 h-3 text-indigo-500" />
                            <span className="text-[10px] font-bold uppercase text-indigo-500">
                                Agent Reasoning
                            </span>
                        </div>
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900 leading-relaxed whitespace-pre-wrap font-medium">
                            {displayedText}
                            {step === 2 && (
                                <span className="inline-block w-1.5 h-3 ml-0.5 bg-indigo-400 animate-pulse" />
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Actions */}
                {step >= 3 && interactions && interactions.length > 0 && (
                    <div className="transition-all duration-500 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Layers className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase text-amber-500">
                                Planned Actions
                            </span>
                        </div>
                        <div className="space-y-1.5">
                            {interactions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-amber-50/50 border border-amber-100 rounded px-2 py-1.5 text-xs text-amber-900"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    <span className="truncate flex-1">
                                        {action.title}
                                    </span>
                                    {action.withNode && (
                                        <span className="text-[9px] bg-white px-1 rounded border border-amber-100 text-amber-700/70">
                                            {action.withNode}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Output */}
                {step >= 4 && (
                    <div className="transition-all duration-500 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center gap-2 mb-1">
                            <ArrowRight className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-bold uppercase text-emerald-500">
                                Result
                            </span>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded p-2 text-xs text-emerald-800 font-medium">
                            Status: SUCCESS
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentReasoningSimulation;
