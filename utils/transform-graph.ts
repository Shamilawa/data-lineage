import { LineageNode, LineageEdge } from "@/types/lineage";

// Helper to generate distinct IDs
const generateId = (prefix: string, baseId: string) => `${prefix}-${baseId}`;

export function transformGraph(rawGraph: any): {
    nodes: LineageNode[];
    edges: LineageEdge[];
} {
    const nodes: LineageNode[] = [];
    const edges: LineageEdge[] = [];

    let stepCounter = 1;

    // Layout Scale Factors to prevent overlap
    const SCALE_X = 2.0;
    const SCALE_Y = 2.5;

    // 1. First Pass: Identify Shared LLMs and calculate their ideal position
    const llmMap = new Map<
        string,
        {
            data: any;
            connectedAgentPositions: { x: number; y: number }[];
        }
    >();

    rawGraph.nodes.forEach((rawNode: any) => {
        if (rawNode.type === "agent_node" && rawNode.data.languageModal) {
            const llm = rawNode.data.languageModal;
            // Group primarily by modelName to handle inconsistent IDs in raw data
            const modelKey = llm.modelName || llm.modelId || "default-model";

            if (!llmMap.has(modelKey)) {
                llmMap.set(modelKey, {
                    data: llm,
                    connectedAgentPositions: [],
                });
            }

            llmMap.get(modelKey)?.connectedAgentPositions.push({
                x: rawNode.position.x * SCALE_X,
                y: rawNode.position.y * SCALE_Y,
            });
        }
    });

    // 2. Create Shared LLM Nodes (Infrastructure Layer)
    llmMap.forEach((info, modelKey) => {
        const sumX = info.connectedAgentPositions.reduce(
            (sum, pos) => sum + pos.x,
            0
        );
        const avgX = sumX / info.connectedAgentPositions.length;

        const sumY = info.connectedAgentPositions.reduce(
            (sum, pos) => sum + pos.y,
            0
        );
        const avgY = sumY / info.connectedAgentPositions.length;
        const layoutY = avgY + 700; // Deep layer below Tools

        nodes.push({
            id: `llm-${modelKey}`,
            type: "llm",
            position: { x: avgX, y: layoutY },
            data: {
                model: info.data.modelName || "Brain",
                provider: info.data.provider,
                label: "Shared Brain",
                status: "success",
                category: "llm_tool",
            },
        });
    });

    // 3. Third Pass: Traversal-based Node & Edge Generation

    // Build maps for traversal
    const adjacencyMap = new Map<string, string[]>();
    rawGraph.edges.forEach((e: any) => {
        if (!adjacencyMap.has(e.source)) adjacencyMap.set(e.source, []);
        adjacencyMap.get(e.source)?.push(e.target);
    });

    const nodeMap = new Map<string, any>();
    rawGraph.nodes.forEach((n: any) => nodeMap.set(n.id, n));

    // Queue for BFS/Traversal
    const queue: string[] = [];

    // Find Start Node(s)
    rawGraph.nodes.forEach((n: any) => {
        if (n.type === "start_node") queue.push(n.id);
    });

    const visited = new Set<string>();

    while (queue.length > 0) {
        const nodeId = queue.shift()!;
        if (visited.has(nodeId)) continue;
        visited.add(nodeId);

        const rawNode = nodeMap.get(nodeId);
        if (!rawNode) continue;

        // Calculate degree (outgoing edges) to apply dynamic spacing
        const outgoingEdges = adjacencyMap.get(nodeId)?.length || 0;

        // Base scale
        let scaledX = rawNode.position.x * SCALE_X;

        // Dynamic Spacing: If node has multiple outgoing connections (hub),
        // give it extra horizontal space to let edges breathe.
        if (outgoingEdges > 1) {
            scaledX += 80; // Push it further right
        }

        const scaledY = rawNode.position.y * SCALE_Y;

        // --- Create Main Node ---
        if (rawNode.type === "start_node") {
            nodes.push({
                id: rawNode.id,
                type: "start",
                position: { x: scaledX, y: scaledY },
                data: { label: rawNode.data.label, status: "success" },
            });
        } else if (rawNode.type === "end_node") {
            nodes.push({
                id: rawNode.id,
                type: "end",
                position: { x: scaledX, y: scaledY },
                data: { label: rawNode.data.label },
            });
        } else if (rawNode.type === "agent_node") {
            nodes.push({
                id: nodeId,
                type: "agent",
                position: { x: scaledX, y: scaledY },
                data: {
                    label: rawNode.data.name,
                    agentType: "Worker",
                    status: "success",
                    inputs: { description: rawNode.data.description },
                    outputs: { result: "Task Completed" },
                    category: "agent_tool",
                },
            });

            // -- Extract Sub-entities & Internal Edges --
            // const promptData = rawNode.data.prompt; // Removed promptData usage
            const llmData = rawNode.data.languageModal;

            // 1. Helper Nodes: Tools & Shared LLM (Placed BELOW Agent)
            // Increased vertical spacing to 400px
            const helperY = scaledY + 400;

            // Internal Flow: Agent -> LLM -> Agent
            if (llmData) {
                const modelKey =
                    llmData.modelName || llmData.modelId || "default-model";
                const llmNodeId = `llm-${modelKey}`;

                // 1. Agent -> Shared LLM
                edges.push({
                    id: `edge-${nodeId}-${llmNodeId}`,
                    source: nodeId,
                    target: llmNodeId,
                    sourceHandle: "bottom",
                    targetHandle: "top",
                    type: "sequence",
                    animated: true,
                    style: { stroke: "#0e7490" },
                    data: { stepNumber: stepCounter++ },
                });

                // 2. Shared LLM -> Agent
                edges.push({
                    id: `edge-${llmNodeId}-${nodeId}`,
                    source: llmNodeId,
                    target: nodeId,
                    sourceHandle: "top-out",
                    targetHandle: "bottom",
                    type: "sequence",
                    animated: true,
                    style: { stroke: "#0e7490" },
                    data: { stepNumber: stepCounter++ },
                });
            }

            // Internal Flow: Agent -> Tools -> Agent
            const tools = rawNode.data.matchTools;
            if (tools && Array.isArray(tools)) {
                tools.forEach((tool: any, index: number) => {
                    const toolId = generateId("tool", `${nodeId}-${index}`);

                    // Horizontal Spacing for Tools
                    // Distribute symmetrically around the agent's center
                    const TOOL_SPACING = 250;
                    const offsetX =
                        (index - (tools.length - 1) / 2) * TOOL_SPACING;
                    const toolX = scaledX + offsetX;

                    nodes.push({
                        id: toolId,
                        type: "tool",
                        position: { x: toolX, y: helperY },
                        data: {
                            label: "Tool",
                            toolName: tool.toolName,
                            description: tool.description,
                            inputs: tool.usage,
                            outputs: tool.output,
                            category: "node_tool",
                        },
                    });

                    // 3. Agent -> Tool
                    edges.push({
                        id: `edge-${nodeId}-${toolId}`,
                        source: nodeId,
                        target: toolId,
                        sourceHandle: "bottom",
                        targetHandle: "top",
                        type: "sequence",
                        animated: true,
                        style: { stroke: "#3b82f6" },
                        data: { stepNumber: stepCounter++ },
                    });

                    // 4. Tool -> Agent (Return)
                    edges.push({
                        id: `edge-${toolId}-${nodeId}`,
                        source: toolId,
                        target: nodeId,
                        sourceHandle: "top-out",
                        targetHandle: "bottom",
                        type: "sequence",
                        animated: true,
                        style: { stroke: "#3b82f6" },
                        data: { stepNumber: stepCounter++ },
                    });
                });
            }
        }

        // --- Process Outgoing Edges ---
        // Find ALL outgoing edges from this node in the raw graph
        // And traverse them
        const targets = adjacencyMap.get(nodeId);
        if (targets) {
            targets.sort(); // Sort targets to have deterministic order if multiple
            targets.forEach((targetId) => {
                // Look up the raw edge to find its specific properties if any
                // Also ensure valid target
                if (nodeMap.get(targetId)) {
                    // Add Main Sequence Edge
                    const rawEdge = rawGraph.edges.find(
                        (e: any) => e.source === nodeId && e.target === targetId
                    );
                    const edgeId = rawEdge
                        ? rawEdge.id
                        : `edge-${nodeId}-${targetId}`;

                    edges.push({
                        id: edgeId,
                        source: nodeId,
                        target: targetId,
                        sourceHandle: "right",
                        targetHandle: "left",
                        type: "sequence",
                        animated: true,
                        data: { stepNumber: stepCounter++ },
                        style: { stroke: "#94a3b8" },
                    });

                    // Add to queue for next iteration
                    queue.push(targetId);
                }
            });
        }
    }

    // 4. Final Pass: Create Group/Layer Nodes
    const groups: LineageNode[] = [];

    // Helper to calculate bounds
    const createGroup = (catId: string, label: string, color: string) => {
        const catNodes = nodes.filter((n) => n.data.category === catId);
        if (catNodes.length === 0) return;

        const minX = Math.min(...catNodes.map((n) => n.position.x));
        const maxX = Math.max(
            ...catNodes.map((n) => {
                // Safety widths based on component styling
                const width =
                    catId === "agent_tool" || catId === "llm_tool" ? 320 : 260; // Agents/LLMs are wider (~280px)
                return n.position.x + width;
            })
        );
        const minY = Math.min(...catNodes.map((n) => n.position.y));
        const maxY = Math.max(
            ...catNodes.map((n) => {
                const height = catId === "agent_tool" ? 180 : 120; // Agents are taller
                return n.position.y + height;
            })
        );

        const padding = 40; // Tightened padding as requested

        groups.push({
            id: `group-${catId}`,
            type: "group",
            position: { x: minX - padding, y: minY - padding },
            style: {
                width: maxX - minX + padding * 2,
                height: maxY - minY + padding * 2,
                zIndex: -1,
                border: "none", // Prevent default React Flow border
                backgroundColor: "transparent", // Prevent default background
            },
            data: {
                label: label,
                color: color,
            },
            draggable: false,
            selectable: false,
        });
    };

    createGroup("agent_tool", "Agents", "#3b82f6"); // Blue
    createGroup("node_tool", "Tools", "#64748b"); // Slate
    createGroup("llm_tool", "Intelligence Sources", "#0e7490"); // Cyan (Enterprise)

    // 5. Post-Process: Assign Parent/Child Relationships
    // This locks the nodes into their groups
    const groupMap = new Map(groups.map((g) => [g.id, g]));

    nodes.forEach((node) => {
        if (node.data.category) {
            const groupId = `group-${node.data.category}`;
            const group = groupMap.get(groupId);

            if (group) {
                // Set Parent
                node.parentId = groupId;
                // Restrict movement to within parent
                node.extent = "parent";

                // Convert Absolute Position to Relative Position
                node.position = {
                    x: node.position.x - group.position.x,
                    y: node.position.y - group.position.y,
                };
            }
        }
    });

    // Parent nodes must come before child nodes in the array
    const finalNodes = [...groups, ...nodes];

    return { nodes: finalNodes, edges };
}
