"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    ConnectionMode,
    NodeTypes,
    EdgeTypes,
    Node,
    NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

import AgentNode from "./nodes/AgentNode";
import LLMNode from "./nodes/LLMNode";
import PromptNode from "./nodes/PromptNode";
import ToolNode from "./nodes/ToolNode";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import SequenceEdge from "./edges/SequenceEdge";
import { DetailsPanel } from "./DetailsPanel";

import { rawGraph } from "@/data/raw-graph";
import { transformGraph } from "@/utils/transform-graph";
import { LineageNode } from "@/types/lineage";

const nodeTypes: NodeTypes = {
    agent: AgentNode,
    llm: LLMNode,
    prompt: PromptNode,
    tool: ToolNode,
    start: StartNode,
    end: EndNode,
};

const edgeTypes: EdgeTypes = {
    sequence: SequenceEdge,
};

const LineageGraphContent = () => {
    // Transform the raw graph once on mount
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        return transformGraph(rawGraph);
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    // Selection State
    const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);

    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        // Cast to LineageNode if needed, or just let TS infer
        setSelectedNode(node as LineageNode);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const closePanel = useCallback(() => {
        setSelectedNode(null);
    }, []);

    return (
        <div className="w-full h-full bg-slate-50 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                connectionMode={ConnectionMode.Loose}
                fitView
            >
                <Background gap={20} color="#cbd5e1" />
                <Controls className="bg-white border-slate-200 text-slate-600 shadow-sm rounded-lg overflow-hidden" />
            </ReactFlow>

            {/* Details Panel Overlay */}
            <DetailsPanel node={selectedNode} onClose={closePanel} />
        </div>
    );
};

export default function LineageGraph() {
    return (
        <ReactFlowProvider>
            <LineageGraphContent />
        </ReactFlowProvider>
    );
}
