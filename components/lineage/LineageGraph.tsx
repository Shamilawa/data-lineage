"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    MiniMap,
    useNodesState,
    useEdgesState,
    NodeMouseHandler,
    EdgeMouseHandler,
    ConnectionMode,
    useReactFlow,
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
import PlaybackControls from "./PlaybackControls";
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

// Define the linear sequence for the demo
const DEMO_STEPS = [
    { id: "start-node", label: "Start" },
    { id: "agent-planner", label: "Planner (In)" },
    { id: "llm-shared", label: "Brain (Intent)" },
    { id: "agent-planner", label: "Planner (Action)" },
    { id: "tool-search", label: "Search Tool" },
    { id: "agent-planner", label: "Planner (Res)" },
    { id: "agent-booking", label: "Booking (In)" },
    { id: "llm-shared", label: "Brain (Policy)" },
    { id: "agent-booking", label: "Booking (Dec)" },
    { id: "tool-email", label: "Email Tool" },
    { id: "agent-booking", label: "Booking (Out)" },
    { id: "end-node", label: "End" },
];

const LineageGraphContent = () => {
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

    // Playback State
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const reactFlowInstance = useReactFlow();

    // Auto-focus logic
    useEffect(() => {
        if (!isSimulationMode) return;
        const activeStepId = DEMO_STEPS[currentStepIndex].id;
        const node = nodes.find((n) => n.id === activeStepId);

        if (node) {
            reactFlowInstance.fitView({
                nodes: [node],
                duration: 800,
                padding: 1.5,
                minZoom: 0.8,
                maxZoom: 1.2,
            });
        }
    }, [currentStepIndex, nodes, reactFlowInstance, isSimulationMode]);

    // Playback Interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && isSimulationMode) {
            interval = setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev >= DEMO_STEPS.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2500); // 2.5s per step
        }
        return () => clearInterval(interval);
    }, [isPlaying, isSimulationMode]);

    // Auto-Inspect Data Flow (Edge Inspector)
    useEffect(() => {
        if (!isSimulationMode) return;

        if (currentStepIndex > 0) {
            const prevStepId = DEMO_STEPS[currentStepIndex - 1].id;
            const currentStepId = DEMO_STEPS[currentStepIndex].id;

            const activeEdge = edges.find(
                (e) => e.source === prevStepId && e.target === currentStepId
            );

            if (activeEdge) {
                // Wrap in timeout to avoid synchronous state update warning during render cycle
                const timer = setTimeout(() => {
                    setSelectedItem(activeEdge as LineageEdge);
                }, 0);
                return () => clearTimeout(timer);
            }
        } else {
            // Optional: Select start node on step 0?
            // setSelectedItem(nodes.find(n => n.id === DEMO_STEPS[0].id) as LineageNode);
        }
    }, [currentStepIndex, isSimulationMode, edges]);

    // Dynamic Styling based on Step
    const visibleNodes = useMemo(() => {
        if (!isSimulationMode) return nodes;

        const activeStepId = DEMO_STEPS[currentStepIndex].id;

        return nodes.map((node) => {
            const isActive = node.id === activeStepId;
            // Focus mode: Dim everything except the active node
            const isDimmed = !isActive;

            return {
                ...node,
                style: {
                    ...node.style,
                    opacity: isDimmed ? 0.3 : 1,
                    filter: isDimmed ? "grayscale(100%)" : "none",
                    border: isActive
                        ? "2px solid #3b82f6"
                        : "1px solid #cbd5e1", // Default border
                    boxShadow: isActive
                        ? "0 0 20px rgba(59, 130, 246, 0.5)"
                        : "none",
                    transition: "all 0.5s ease-in-out",
                    zIndex: isActive ? 10 : 1,
                },
            };
        });
    }, [nodes, currentStepIndex, isSimulationMode]);

    const visibleEdges = useMemo(() => {
        if (!isSimulationMode) return edges;

        // Highlight logic: Find the edge connecting Step[current-1] -> Step[current]
        let activeEdgeId: string | undefined;

        if (currentStepIndex > 0) {
            const prevStepId = DEMO_STEPS[currentStepIndex - 1].id;
            const currentStepId = DEMO_STEPS[currentStepIndex].id;

            // Find the active edge matching this specific transition
            // Need to handle bi-directional checks if edges aren't strictly one-way in ID
            const specificEdge = edges.find(
                (e) => e.source === prevStepId && e.target === currentStepId
            );

            if (specificEdge) activeEdgeId = specificEdge.id;
        }

        return edges.map((edge) => {
            const isActive = edge.id === activeEdgeId;
            const isDimmed = !isActive;

            return {
                ...edge,
                animated: isActive,
                style: {
                    ...edge.style,
                    stroke: isActive ? "#3b82f6" : "#cbd5e1",
                    opacity: isDimmed ? 0.2 : 1,
                    strokeWidth: isActive ? 3 : 1,
                },
            };
        });
    }, [edges, currentStepIndex, isSimulationMode]);

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
            <ReactFlow
                nodes={visibleNodes}
                edges={visibleEdges}
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
                        const stepIndex = DEMO_STEPS.findIndex(
                            (s) => s.id === n.id
                        );
                        if (stepIndex !== -1 && stepIndex > currentStepIndex)
                            return "#e2e8f0"; // Dim future nodes
                        if (n.type === "agent") return "#3b82f6";
                        if (n.type === "llm") return "#0e7490";
                        return "#94a3b8";
                    }}
                />
            </ReactFlow>

            {/* Simulation Trigger Button */}
            {!isSimulationMode && (
                <button
                    onClick={() => setIsSimulationMode(true)}
                    className="absolute top-4 right-4 z-50 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-md border border-slate-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Simulation Mode
                </button>
            )}

            {/* Playback Controls */}
            {isSimulationMode && (
                <PlaybackControls
                    steps={DEMO_STEPS}
                    currentStepIndex={currentStepIndex}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onPrev={() =>
                        setCurrentStepIndex((p) => Math.max(0, p - 1))
                    }
                    onNext={() =>
                        setCurrentStepIndex((p) =>
                            Math.min(DEMO_STEPS.length - 1, p + 1)
                        )
                    }
                    onStepClick={setCurrentStepIndex}
                    onClose={() => {
                        setIsSimulationMode(false);
                        setIsPlaying(false);
                        setCurrentStepIndex(0);
                        // Reset view
                        reactFlowInstance.fitView({ duration: 800 });
                    }}
                />
            )}

            {/* Inspector Slide-over */}
            <InspectorPanel
                selectedItem={selectedItem}
                nodes={nodes}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

const LineageGraph = () => {
    return (
        <ReactFlowProvider>
            <LineageGraphContent />
        </ReactFlowProvider>
    );
};

export default LineageGraph;
