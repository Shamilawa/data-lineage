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
import { marketIntelligenceWorkflow } from "@/data/market-intelligence-workflow";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import AgentNode from "./nodes/AgentNode";
import LLMNode from "./nodes/LLMNode";
import PromptNode from "./nodes/PromptNode";
import ToolNode from "./nodes/ToolNode";
import GroupNode from "./nodes/GroupNode";
import SupervisorNode from "./nodes/SupervisorNode";
import DataStoreNode from "./nodes/DataStoreNode";
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
    supervisor: SupervisorNode,
    "data-store": DataStoreNode,
    group: GroupNode,
};

const edgeTypes = {
    sequence: SequenceEdge,
};

// Define the linear sequence for the demo (Dynamic now)
// const DEMO_STEPS = ... (removed)

const LineageGraphContent = () => {
    const reactFlowInstance = useReactFlow();
    const [activeWorkflowKey, setActiveWorkflowKey] = useState<
        "flight" | "market"
    >("flight");

    const activeWorkflowData = useMemo(() => {
        return activeWorkflowKey === "flight"
            ? flightWorkflowGraph
            : marketIntelligenceWorkflow;
    }, [activeWorkflowKey]);

    // 1. Transform Data
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => transformGraph(activeWorkflowData),
        [activeWorkflowData]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes when workflow changes
    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
        // Reset view
        setTimeout(() => reactFlowInstance.fitView({ duration: 800 }), 100);
    }, [initialNodes, initialEdges, reactFlowInstance, setNodes, setEdges]);

    const [selectedItem, setSelectedItem] = useState<
        LineageNode | LineageEdge | null
    >(null);

    // Playback State
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSimulationMode, setIsSimulationMode] = useState(false);

    // Dynamic Simulation Steps Calculation
    const simulationSteps = useMemo(() => {
        const steps: { id: string; label: string }[] = [];

        // 1. Find Start Node
        const startNode = nodes.find((n) => n.type === "start");
        if (startNode) {
            steps.push({
                id: startNode.id,
                label: startNode.data.label || "Start",
            });
        }

        // 2. Sort edges by stepNumber
        const sortedEdges = [...edges]
            .filter((e) => typeof e.data?.stepNumber === "number")
            .sort(
                (a, b) => (a.data?.stepNumber || 0) - (b.data?.stepNumber || 0)
            );

        // 3. Add target nodes of the sequence
        sortedEdges.forEach((edge) => {
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (targetNode) {
                // Optional: Add custom label logic here if needed (e.g. "Planner (In)")
                // For now, use the node's main label
                steps.push({
                    id: targetNode.id,
                    label: targetNode.data.label || targetNode.id,
                });
            }
        });

        // Ensure we have unique steps if the start node is also targeted?
        // No, repetition is good for flow.

        return steps;
    }, [nodes, edges]);

    // Auto-focus logic
    useEffect(() => {
        if (!isSimulationMode) return;
        if (simulationSteps.length === 0) return;

        // Safety check for index
        const safeIndex = Math.min(
            currentStepIndex,
            simulationSteps.length - 1
        );
        const activeStepId = simulationSteps[safeIndex].id;
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
    }, [
        currentStepIndex,
        nodes,
        reactFlowInstance,
        isSimulationMode,
        simulationSteps,
    ]);

    // Playback Interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && isSimulationMode) {
            interval = setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev >= simulationSteps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2500); // 2.5s per step
        }
        return () => clearInterval(interval);
    }, [isPlaying, isSimulationMode, simulationSteps]);

    // Auto-Inspect Data Flow (Edge Inspector)
    useEffect(() => {
        if (!isSimulationMode) return;
        if (simulationSteps.length === 0) return;

        if (currentStepIndex > 0) {
            // In the dynamic model, Step N corresponds to the edge leading TO Step N
            // BUT, our steps array is [Start, Target1, Target2...]
            // So Index 1 is Target1. The edge is Start -> Target1.
            // Let's try to find the edge that connects Step[i-1] to Step[i]

            const prevStepId = simulationSteps[currentStepIndex - 1].id;
            const currentStepId = simulationSteps[currentStepIndex].id;

            // Find edge connecting them
            // Note: In complex graphs, there might be multiple.
            // We should ideally use the edge's stepNumber to disambiguate, but we don't have it easily here maped 1:1.
            // Actually, constructing simulationSteps from edges would have given us the Edge ID too!
            // Update: Let's assume the first match is correct for now, or refine `simulationSteps` to include `edgeId`.

            const activeEdge = edges.find(
                (e) => e.source === prevStepId && e.target === currentStepId
            );

            if (activeEdge) {
                const timer = setTimeout(() => {
                    setSelectedItem(activeEdge as LineageEdge);
                }, 0);
                return () => clearTimeout(timer);
            }
        }
    }, [currentStepIndex, isSimulationMode, edges, simulationSteps]);

    // Dynamic Styling based on Step
    const visibleNodes = useMemo(() => {
        if (!isSimulationMode) return nodes;
        if (simulationSteps.length === 0) return nodes;

        const safeIndex = Math.min(
            currentStepIndex,
            simulationSteps.length - 1
        );
        const activeStepId = simulationSteps[safeIndex].id;

        return nodes.map((node) => {
            const isActive = node.id === activeStepId;
            const isDimmed = !isActive;

            return {
                ...node,
                style: {
                    ...node.style,
                    opacity: isDimmed ? 0.3 : 1,
                    filter: isDimmed ? "grayscale(100%)" : "none",
                    border: isActive
                        ? "2px solid #3b82f6"
                        : "1px solid #cbd5e1",
                    boxShadow: isActive
                        ? "0 0 20px rgba(59, 130, 246, 0.5)"
                        : "none",
                    transition: "all 0.5s ease-in-out",
                    zIndex: isActive ? 10 : 1,
                },
            };
        });
    }, [nodes, currentStepIndex, isSimulationMode, simulationSteps]);

    const visibleEdges = useMemo(() => {
        if (!isSimulationMode) return edges;
        if (simulationSteps.length === 0) return edges;

        // Highlight logic
        let activeEdgeId: string | undefined;

        if (currentStepIndex > 0) {
            const prevStepId = simulationSteps[currentStepIndex - 1].id;
            const currentStepId = simulationSteps[currentStepIndex].id;

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
    }, [edges, currentStepIndex, isSimulationMode, simulationSteps]);

    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
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
            {/* Header / Workflow Switcher */}
            <div className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 px-2">
                    Workflow:
                </span>
                <select
                    value={activeWorkflowKey}
                    onChange={(e) => {
                        setActiveWorkflowKey(
                            e.target.value as "flight" | "market"
                        );
                        setIsSimulationMode(false);
                        setSelectedItem(null);
                    }}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none outline-none cursor-pointer hover:bg-slate-50 rounded px-1 py-0.5"
                >
                    <option value="flight">Flight Booking Demo</option>
                    <option value="market">
                        Enterprise Market Intelligence
                    </option>
                </select>
            </div>

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
                        const stepIndex = simulationSteps.findIndex(
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
                    steps={simulationSteps}
                    currentStepIndex={currentStepIndex}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onPrev={() =>
                        setCurrentStepIndex((p) => Math.max(0, p - 1))
                    }
                    onNext={() =>
                        setCurrentStepIndex((p) =>
                            Math.min(simulationSteps.length - 1, p + 1)
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
