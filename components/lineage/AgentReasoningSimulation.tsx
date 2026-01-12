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
    Database,
    Layers,
    RefreshCcw,
    Activity,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AgentReasoningSimulation = ({
    aiExplanation,
    reasoning,
    inputs,
    outputs,
    interactions,
    onReset,
}: {
    aiExplanation?: string;
    reasoning: string;
    inputs: any;
    outputs: any;
    interactions: any[];
    onReset: () => void;
}) => {
    // 0: Start, 1: Context, 2: AI Explainer, 3: Technical Reasoning, 4: Actions, 5: Output
    const [step, setStep] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [displayedExplanation, setDisplayedExplanation] = useState("");

    // Simulate the sequence
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (step === 0) {
            timeout = setTimeout(() => setStep(1), 500);
        } else if (step === 1) {
            timeout = setTimeout(() => setStep(2), 1500); // Input -> AI Explainer
        } else if (step === 2) {
            // Typewriter effect handles transition to step 3
        } else if (step === 3) {
            // Typewriter effect handles transition to step 4
        } else if (step === 4) {
            timeout = setTimeout(() => setStep(5), 2000); // Actions -> Output
        }
        return () => clearTimeout(timeout);
    }, [step]);

    // Typewriter effect for AI Explanation (Step 2)
    useEffect(() => {
        if (step === 2 && aiExplanation) {
            let i = 0;
            const speed = 10; // Slightly slower for readability
            const type = () => {
                if (i < aiExplanation.length) {
                    setDisplayedExplanation(aiExplanation.slice(0, i + 1));
                    i++;
                    setTimeout(type, speed);
                } else {
                    setTimeout(() => setStep(3), 1500); // Pause before moving to reasoning
                }
            };
            type();
        } else if (step === 2 && !aiExplanation) {
            // Skip if no explanation
            setStep(3);
        }
    }, [step, aiExplanation]);

    // Typewriter effect for Reasoning (Step 3)
    useEffect(() => {
        if (step === 3) {
            let i = 0;
            const speed = 5; // Faster typing
            const type = () => {
                if (i < reasoning.length) {
                    setDisplayedText(reasoning.slice(0, i + 1));
                    i++;
                    setTimeout(type, speed);
                } else {
                    setTimeout(() => setStep(4), 1000);
                }
            };
            type();
        }
    }, [step, reasoning]);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "p-1.5 rounded-full border transition-all duration-500",
                            step >= 5
                                ? "bg-slate-100 border-slate-200 text-slate-700"
                                : "bg-blue-50 border-blue-100 text-blue-600 shadow-sm"
                        )}
                    >
                        {step >= 5 ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Activity className="w-4 h-4 animate-pulse" />
                        )}
                    </div>
                    <span className="text-xs font-semibold uppercase text-slate-500 track-wider">
                        {step === 1 && "Analyzing Input..."}
                        {step === 2 && "Synthesizing Explanation..."}
                        {step === 3 && "Internal Processing..."}
                        {step === 4 && "Executing Actions..."}
                        {step === 5 && "Process Complete"}
                    </span>
                </div>
                <button
                    onClick={onReset}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
                >
                    <RefreshCcw className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="space-y-4 relative pl-1">
                {/* Step 1: Input Context */}
                <div
                    className={cn(
                        "transition-all duration-500",
                        step >= 1
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2"
                    )}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] font-semibold text-slate-700">
                            Context Data
                        </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-600 font-mono shadow-sm">
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

                {/* Step 2: AI Generated Explanation (User Friendly) */}
                {step >= 2 && aiExplanation && (
                    <div className="transition-all duration-500 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[11px] font-semibold text-slate-700">
                                AI Explanation
                            </span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-md p-3 text-xs text-slate-700 leading-relaxed relative overflow-hidden">
                            {/* Subtle highlight instead of shimmer */}
                            {/* <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-300" /> */}
                            {displayedExplanation}
                            {step === 2 && (
                                <span className="inline-block w-1.5 h-3 ml-0.5 bg-slate-400 animate-pulse" />
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Reasoning (The Core) */}
                {step >= 3 && (
                    <div className="transition-all duration-500 animate-in fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <BrainCircuit className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[11px] font-semibold text-slate-700">
                                Reasoning Trace
                            </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-mono shadow-inner">
                            {displayedText}
                            {step === 3 && (
                                <span className="inline-block w-1.5 h-3 ml-0.5 bg-slate-400 animate-pulse" />
                            )}
                        </div>
                    </div>
                )}

                {/* Step 4: Actions */}
                {step >= 4 && interactions && interactions.length > 0 && (
                    <div className="transition-all duration-500 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[11px] font-semibold text-slate-700">
                                Actions
                            </span>
                        </div>
                        <div className="space-y-2">
                            {interactions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 shadow-sm"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <span className="truncate flex-1 font-medium">
                                        {action.title}
                                    </span>
                                    {action.withNode && (
                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">
                                            {action.withNode}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Output */}
                {step >= 5 && (
                    <div className="transition-all duration-500 animate-in fade-in slide-in-from-left-2 pt-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md">
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">
                                Finished
                            </span>
                            <div className="w-full h-px bg-slate-200 flex-1 mx-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                Success
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentReasoningSimulation;
