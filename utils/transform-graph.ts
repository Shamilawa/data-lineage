import { LineageNode, LineageEdge } from "@/types/lineage";

export interface WorkflowDefinition {
    nodes: LineageNode[];
    edges: LineageEdge[];
}

// Helper to calculate group dimensions based on children
const NODE_WIDTH_ESTIMATE = 250;
const BASE_PADDING_X = 50;
const BASE_PADDING_Y = 80;

const calculateGroupStyle = (
    children: LineageNode[],
    defaultWidth: number,
    defaultHeight: number
) => {
    if (children.length === 0)
        return {
            width: defaultWidth,
            height: defaultHeight,
            zIndex: -1,
            border: "none",
            backgroundColor: "transparent",
        };

    // Find max extent of children
    const maxX = Math.max(...children.map((c) => c.position.x));
    const maxY = Math.max(...children.map((c) => c.position.y));

    return {
        width: maxX + NODE_WIDTH_ESTIMATE + BASE_PADDING_X,
        height: maxY + 120 + BASE_PADDING_Y, // Height + padding
        zIndex: -1,
        border: "none",
        backgroundColor: "transparent",
    };
};

export function transformGraph(rawGraph: WorkflowDefinition): {
    nodes: LineageNode[];
    edges: LineageEdge[];
} {
    // This function now assumes rawGraph is already in the correct structure
    // but we might want to recalculate group dimensions if they are dynamic properties of the raw graph's children.

    // However, for this implementation, we will trust the input structure but ensure Groups are sized correctly IF they exist.
    // The previous implementation constructed the whole graph inside this function.
    // Now we expect "rawGraph" to contain the nodes and edges, but perhaps we need to layout the groups?

    // To keep it compatible with the previous hardcoded "flightBooking" logic which did layout:
    // We will iterate over groups and update their style based on their children.

    const nodes = [...rawGraph.nodes];
    const edges = [...rawGraph.edges];

    // Identify Groups
    const groups = nodes.filter((n) => n.type === "group");

    groups.forEach((group) => {
        const children = nodes.filter((n) => n.parentId === group.id);
        if (children.length > 0) {
            // Recalculate style
            const style = calculateGroupStyle(children, 650, 250);

            // If the group is "Intelligence" (shared), we might want to expand it to the full width
            // This is a bit specific to the "Shared Brain" concept, but we can check if it has a specific flag or ID pattern.
            // For now, let's just apply the calculated style.

            // Preserve existing styling if needed, but update dimensions
            group.style = { ...group.style, ...style };
        }
    });

    // Special handling for "Shared Intelligence" group width if present
    // If we have multiple main groups (Agents, Tools), and a Shared Intelligence group,
    // we often want the Intelligence group to span the width of the others.
    const agentGroup = groups.find((g) => g.data.label === "Agents");
    const toolGroup = groups.find((g) => g.data.label === "Tools");
    const intelligenceGroup = groups.find(
        (g) => g.data.label === "Intelligence Sources"
    );

    if (agentGroup && toolGroup && intelligenceGroup) {
        const maxW = Math.max(
            Number(agentGroup.style?.width || 0),
            Number(toolGroup.style?.width || 0)
        );

        if (maxW > Number(intelligenceGroup.style?.width || 0)) {
            intelligenceGroup.style = {
                ...intelligenceGroup.style,
                width: maxW,
            };

            // Also execute logic to center the "Brain" node if it exists in this group
            const brainNodes = nodes.filter(
                (n) => n.parentId === intelligenceGroup.id
            );
            if (brainNodes.length === 1) {
                const brainNode = brainNodes[0];
                const centeredX = (maxW - 250) / 2; // 250 is approx node width
                brainNode.position = {
                    ...brainNode.position,
                    x: Math.max(50, centeredX),
                };
            }
        }
    }

    return { nodes, edges };
}
