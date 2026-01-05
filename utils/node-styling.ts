import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Returns Tailwind classes for the "Traffic Light" status visualization.
 *
 * @param status - The logic state of the node (active, success, failure, skipped, idle)
 * @returns string - Tailwind class string
 */
export const getNodeStatusStyles = (
    status: "active" | "success" | "failure" | "idle" | "skipped" | undefined
) => {
    // Base styles (card shape, common borders)
    const baseStyles =
        "rounded-md border shadow-sm transition-all duration-300";

    switch (status) {
        case "success":
            return twMerge(
                baseStyles,
                "border-emerald-500 bg-emerald-50/50 text-emerald-900"
            );
        case "failure":
            return twMerge(
                baseStyles,
                "border-red-500 bg-red-50 text-red-900 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse"
            );
        case "skipped":
            return twMerge(
                baseStyles,
                "border-amber-500 bg-amber-50 text-amber-900"
            );
        case "active":
            return twMerge(
                baseStyles,
                "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-200"
            );
        case "idle":
        default:
            return twMerge(
                baseStyles,
                "border-slate-200 bg-white grayscale hover:grayscale-0"
            );
    }
};

/**
 * Returns the color for the status pill/badge inside the node
 */
export const getStatusBadgeStyles = (
    status: "active" | "success" | "failure" | "idle" | "skipped" | undefined
) => {
    switch (status) {
        case "success":
            return "bg-emerald-100 text-emerald-700";
        case "failure":
            return "bg-red-100 text-red-700 font-bold animate-pulse";
        case "skipped":
            return "bg-amber-100 text-amber-700";
        case "active":
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-slate-100 text-slate-500";
    }
};

/**
 * Returns the label text to display for the status
 */
export const getStatusLabel = (
    status: "active" | "success" | "failure" | "idle" | "skipped" | undefined
) => {
    if (!status) return "Idle";
    return status.charAt(0).toUpperCase() + status.slice(1);
};
