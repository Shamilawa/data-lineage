import React, { memo } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getBezierPath,
} from "reactflow";
import { SequenceEdgeData } from "@/types/lineage";

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
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-50 border border-slate-300 shadow-sm text-[10px] font-bold text-slate-600 z-50">
                            {data.stepNumber}
                        </div>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};

export default memo(SequenceEdge);
