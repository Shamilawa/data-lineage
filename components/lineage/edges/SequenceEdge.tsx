import React, { memo } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getBezierPath,
} from "reactflow";
import { SequenceEdgeData } from "@/types/lineage";
import clsx from "clsx";

const SequenceEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps<SequenceEdgeData>) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetPosition,
        targetX,
        targetY,
    });

    const isActive = style.stroke === "#3b82f6";

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            {data?.stepNumber && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            fontSize: 12,
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan"
                    >
                        <div
                            className={clsx(
                                "flex items-center justify-center w-5 h-5 rounded-full border shadow-sm text-[10px] font-bold z-50 transition-all duration-300",
                                isActive
                                    ? "bg-blue-600 border-blue-600 text-white scale-125 shadow-blue-300 ring-2 ring-blue-100"
                                    : "bg-slate-50 border-slate-300 text-slate-600"
                            )}
                        >
                            {data.stepNumber}
                        </div>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};

export default memo(SequenceEdge);
