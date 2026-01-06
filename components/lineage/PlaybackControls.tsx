"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    label: string;
}

interface PlaybackControlsProps {
    steps: Step[];
    currentStepIndex: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onStepClick: (index: number) => void;
    onClose: () => void;
}

const PlaybackControls = ({
    steps,
    currentStepIndex,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    onStepClick,
    onClose,
}: PlaybackControlsProps) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-6 duration-500">
            <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/60 rounded-full px-2 py-2 flex items-center gap-3">
                {/* 1. Playback Buttons (Compact Group) */}
                <div className="flex items-center gap-1 pl-2">
                    <button
                        onClick={onPrev}
                        disabled={currentStepIndex === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors rounded-full hover:bg-slate-100"
                    >
                        <SkipBack className="w-4 h-4 fill-current" />
                    </button>
                    <button
                        onClick={onPlayPause}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                        {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentStepIndex === steps.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors rounded-full hover:bg-slate-100"
                    >
                        <SkipForward className="w-4 h-4 fill-current" />
                    </button>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200" />

                {/* 2. Compact Timeline */}
                <div className="relative flex items-center h-8 px-2 min-w-[300px] max-w-[500px]">
                    {/* Background Line */}
                    <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-10" />

                    {/* Active Progress Line */}
                    <div
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-300 ease-in-out"
                        style={{
                            width: `${
                                (currentStepIndex / (steps.length - 1)) * 100
                            }%`,
                        }}
                    />

                    {/* Step Dots */}
                    <div className="w-full flex justify-between items-center">
                        {steps.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => onStepClick(index)}
                                    className="group relative flex items-center justify-center focus:outline-none w-4 h-4"
                                >
                                    {/* The Dot */}
                                    <div
                                        className={cn(
                                            "rounded-full border transition-all duration-300 z-10",
                                            isActive
                                                ? "w-3 h-3 bg-blue-600 border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.15)]"
                                                : isCompleted
                                                ? "w-2 h-2 bg-blue-400 border-blue-400"
                                                : "w-1.5 h-1.5 bg-white border-slate-300 group-hover:border-slate-400 group-hover:w-2 group-hover:h-2"
                                        )}
                                    />

                                    {/* Label (Tooltip Style) */}
                                    {/* Only show label for ACTIVE step to save space, or on hover */}
                                    <span
                                        className={cn(
                                            "absolute bottom-6 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md",
                                            isActive
                                                ? "opacity-100 -translate-y-0" // Always show active? Or maybe let user hover?
                                                : // User requested "Enhance it". Let's show active + hover
                                                  "group-hover:opacity-100 group-hover:-translate-y-1 translate-y-2"
                                        )}
                                        style={{
                                            transform: isActive
                                                ? ""
                                                : undefined,
                                        }}
                                    >
                                        {step.label}
                                        {/* Tiny arrow */}
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200" />

                {/* 3. Close Button */}
                <button
                    onClick={onClose}
                    className="p-1.5 mr-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Exit Simulation"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PlaybackControls;
