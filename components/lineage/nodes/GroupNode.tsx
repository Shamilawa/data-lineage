import React, { memo } from "react";
import { NodeProps } from "reactflow";
import clsx from "clsx";

interface GroupNodeData {
    label: string;
    color?: string; // Hex color
}

const GroupNode = ({ data, style }: NodeProps<GroupNodeData>) => {
    // We expect 'style' to contain width/height from React Flow
    // We expect 'data.color' to be the base color.

    // We will render a container that matches the node's dimensions
    // We use the color for the border and a light background tint.
    // The label is rendered in a distinct header tag.

    const color = data.color || "#94a3b8"; // Default slate-400

    return (
        <div
            className="w-full h-full relative rounded-md border-2 transition-colors"
            style={{
                borderColor: color,
                backgroundColor: `${color}0D`, // ~5% opacity for content area
            }}
        >
            {/* Title Label - Positioned absolutely at top-left, slightly outside or inside? 
                User asked for "Title for each group". 
                "Enterprise" style usually means a clean label inside or floating on border.
                Let's put it inside, top-left.
            */}
            <div
                className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-sm text-white shadow-sm"
                style={{ backgroundColor: color }}
            >
                {data.label}
            </div>
        </div>
    );
};

export default memo(GroupNode);
