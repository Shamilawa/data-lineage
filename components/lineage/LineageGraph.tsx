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
import { ScanEye } from "lucide-react";
import clsx from "clsx";
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

    const [isInspectorMode, setIsInspectorMode] = useState(false);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const onNodeMouseEnter = useCallback(
        (_: React.MouseEvent, node: LineageNode) => {
            if (!isInspectorMode || node.type === "group") return;
            setHoveredNodeId(node.id);
        },
        [isInspectorMode]
    );

    const onNodeMouseLeave = useCallback(() => {
        setHoveredNodeId(null);
    }, []);

    // Dynamic Styling based on Step OR Hover
    const visibleNodes = useMemo(() => {
        // 1. Simulation Mode Parsing
        let simulationActiveNodeId: string | null = null;
        if (isSimulationMode && simulationSteps.length > 0) {
            const safeIndex = Math.min(
                currentStepIndex,
                simulationSteps.length - 1
            );
            simulationActiveNodeId = simulationSteps[safeIndex].id;
        }

        if (!isSimulationMode && !hoveredNodeId) return nodes;

        // Helper to check connections
        const getConnectedNodeIds = (nodeId: string) => {
            const connectedIds = new Set<string>();
            edges.forEach((e) => {
                if (e.source === nodeId) connectedIds.add(e.target);
                if (e.target === nodeId) connectedIds.add(e.source);
            });
            return connectedIds;
        };

        const connectedToHover = hoveredNodeId
            ? getConnectedNodeIds(hoveredNodeId)
            : new Set();

        return nodes.map((node) => {
            // Priority: Hover > Simulation
            let isDimmed = false;
            let isActive = false;

            if (hoveredNodeId) {
                // Hover Mode: Highlight Self + Neighbors
                const isNeighbor = connectedToHover.has(node.id);
                isActive = node.id === hoveredNodeId || isNeighbor;
                isDimmed = !isActive;
            } else if (simulationActiveNodeId) {
                // Simulation Mode
                isActive = node.id === simulationActiveNodeId;
                isDimmed = !isActive;
            }

            return {
                ...node,
                style: {
                    ...node.style,
                    opacity: isDimmed ? 0.25 : 1,
                    filter: isDimmed ? "grayscale(100%)" : "none",
                    border: isActive
                        ? "2px solid #3b82f6"
                        : "1px solid #cbd5e1",
                    boxShadow: isActive
                        ? "0 0 20px rgba(59, 130, 246, 0.5)"
                        : "none",
                    transition: "all 0.3s ease-in-out",
                    zIndex: isActive ? 10 : 1,
                },
            };
        });
    }, [
        nodes,
        edges,
        currentStepIndex,
        isSimulationMode,
        simulationSteps,
        hoveredNodeId,
    ]);

    const visibleEdges = useMemo(() => {
        // 1. Simulation Active Edge
        let simulationActiveEdgeId: string | undefined;
        if (
            isSimulationMode &&
            simulationSteps.length > 0 &&
            currentStepIndex > 0
        ) {
            const prevStepId = simulationSteps[currentStepIndex - 1].id;
            const currentStepId = simulationSteps[currentStepIndex].id;
            const specificEdge = edges.find(
                (e) => e.source === prevStepId && e.target === currentStepId
            );
            if (specificEdge) simulationActiveEdgeId = specificEdge.id;
        }

        return edges.map((edge) => {
            // Determine if this is a "Shared Brain" edge (connected to LLM)
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            const isSharedBrainEdge =
                sourceNode?.type === "llm" || targetNode?.type === "llm";

            let style = { ...edge.style };
            let animated = edge.animated;
            let stroke = style.stroke || "#cbd5e1";
            let opacity = 1;
            let width = 1;

            // Base Style (Standard)
            opacity = 1;
            // Removed de-emphasis for shared brain edges as per user request
            // if (isSharedBrainEdge) { ... }

            // Interactive States
            if (hoveredNodeId) {
                // Hover Logic
                const isConnectedToHover =
                    edge.source === hoveredNodeId ||
                    edge.target === hoveredNodeId;

                if (isConnectedToHover) {
                    // Highlight Active Path (even for Brain edges)
                    opacity = 1;
                    stroke = "#3b82f6"; // Blue-500
                    width = 2.5;
                    animated = true;
                    style.strokeDasharray = "none"; // Reset dash
                } else {
                    // Dim unrelated
                    opacity = 0.05;
                }
            } else if (isSimulationMode) {
                // Simulation Logic
                const isSimActive = edge.id === simulationActiveEdgeId;
                if (isSimActive) {
                    opacity = 1;
                    stroke = "#3b82f6";
                    width = 3;
                    animated = true;
                } else {
                    opacity = isSharedBrainEdge ? 0.1 : 0.2;
                }
            }

            return {
                ...edge,
                animated: animated,
                style: {
                    ...style,
                    stroke,
                    opacity,
                    strokeWidth: width,
                    transition: "all 0.3s ease-in-out",
                },
                zIndex:
                    hoveredNodeId &&
                    (edge.source === hoveredNodeId ||
                        edge.target === hoveredNodeId)
                        ? 50
                        : 0,
            };
        });
    }, [
        nodes,
        edges,
        currentStepIndex,
        isSimulationMode,
        simulationSteps,
        hoveredNodeId,
    ]);

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
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
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
            {/* Simulation & Inspector Triggers */}
            {!isSimulationMode && (
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <button
                        onClick={() => {
                            const newMode = !isInspectorMode;
                            setIsInspectorMode(newMode);
                            if (!newMode) setHoveredNodeId(null);
                        }}
                        className={clsx(
                            "bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-md border border-slate-200 flex items-center gap-2 transition-all active:scale-95",
                            isInspectorMode &&
                                "ring-2 ring-blue-500 ring-offset-1 text-blue-700 bg-blue-50"
                        )}
                    >
                        <ScanEye
                            className={clsx(
                                "w-4 h-4",
                                isInspectorMode && "text-blue-600"
                            )}
                        />
                        {isInspectorMode
                            ? "Inspector Active"
                            : "Enable Inspector"}
                    </button>

                    <button
                        onClick={() => setIsSimulationMode(true)}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-md border border-slate-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Simulation Mode
                    </button>
                </div>
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
