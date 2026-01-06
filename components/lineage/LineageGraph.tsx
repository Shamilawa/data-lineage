"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    NodeMouseHandler,
    EdgeMouseHandler,
    ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { transformGraph } from "@/utils/transform-graph";
import { flightWorkflowGraph } from "@/data/flight-workflow";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import AgentNode from "./nodes/AgentNode";
import LLMNode from "./nodes/LLMNode";
import PromptNode from "./nodes/PromptNode";
import ToolNode from "./nodes/ToolNode";
import GroupNode from "./nodes/GroupNode";
import SequenceEdge from "./edges/SequenceEdge";
import InspectorPanel from "./InspectorPanel";
import { LineageNode, LineageEdge } from "@/types/lineage";

const nodeTypes = {
    start: StartNode,
    end: EndNode,
    agent: AgentNode,
    llm: LLMNode,
    prompt: PromptNode,
    tool: ToolNode,
    group: GroupNode,
};

const edgeTypes = {
    sequence: SequenceEdge,
};

const LineageGraph = () => {
    // 1. Transform Data
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => transformGraph(flightWorkflowGraph),
        []
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [selectedItem, setSelectedItem] = useState<
        LineageNode | LineageEdge | null
    >(null);

    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        // Don't inspect group nodes
        if (node.type !== "group") {
            setSelectedItem(node as LineageNode);
        } else {
            setSelectedItem(null);
        }
    }, []);

    const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
        setSelectedItem(edge as LineageEdge);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedItem(null);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-50">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    minZoom={0.1}
                >
                    <Background color="#cbd5e1" gap={16} />
                    <Controls className="bg-white border-slate-200 shadow-sm text-slate-500" />
                    <MiniMap
                        className="bg-white border-slate-200 shadow-sm"
                        nodeColor={(n) => {
                            if (n.type === "agent") return "#3b82f6";
                            if (n.type === "llm") return "#0e7490";
                            return "#e2e8f0";
                        }}
                    />
                </ReactFlow>
                {/* Inspector Slide-over */}
                <InspectorPanel
                    selectedItem={selectedItem}
                    nodes={nodes}
                    onClose={() => setSelectedItem(null)}
                />
            </ReactFlowProvider>
        </div>
    );
};

export default LineageGraph;
