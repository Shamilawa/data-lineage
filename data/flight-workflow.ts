import { LineageNode, LineageEdge } from "@/types/lineage";

// --- Flight Booking Workflow Data (Previously Hardcoded in transform-graph.ts) ---

const NODE_WIDTH_ESTIMATE = 250;
const BASE_PADDING_X = 50;
const BASE_PADDING_Y = 80;

// Groups
const agentGroup: LineageNode = {
    id: "group-agent_tool",
    type: "group",
    position: { x: 350, y: 100 },
    style: {
        width: 650,
        height: 250,
        zIndex: -1,
        border: "none",
        backgroundColor: "transparent",
    },
    data: { label: "Agents", color: "#3b82f6" },
    draggable: false,
};

const toolGroup: LineageNode = {
    id: "group-node_tool",
    type: "group",
    position: { x: 350, y: 450 },
    style: {
        width: 650,
        height: 200,
        zIndex: -1,
        border: "none",
        backgroundColor: "transparent",
    },
    data: { label: "Tools", color: "#64748b" },
    draggable: false,
};

const intelligenceGroup: LineageNode = {
    id: "group-llm_tool",
    type: "group",
    position: { x: 350, y: 750 },
    style: {
        width: 650,
        height: 200,
        zIndex: -1,
        border: "none",
        backgroundColor: "transparent",
    },
    data: { label: "Intelligence Sources", color: "#0e7490" },
    draggable: false,
};
// Note: Widths are estimates, transformGraph might adjust them but we provide defaults.

// Nodes
const startNode: LineageNode = {
    id: "start-1",
    type: "start",
    position: { x: 50, y: 180 },
    data: {
        label: "User Request",
        status: "success",
        description:
            "Initiates the workflow with the user's initial travel query.",
    },
};

const plannerAgent: LineageNode = {
    id: "agent-planner",
    type: "agent",
    parentId: "group-agent_tool",
    extent: "parent",
    position: { x: 50, y: 80 },
    data: {
        label: "Planner Agent",
        agentType: "Worker",
        status: "success",
        description: "Analyzes user requests to determine travel intent.",
        agentReasoning: `**User Intent Analysis:**\nThe user has clearly expressed a desire to book a flight to **New York City** for **next Friday**.`,
        duration: "1.2s",
    },
};

const bookingAgent: LineageNode = {
    id: "agent-booking",
    type: "agent",
    parentId: "group-agent_tool",
    extent: "parent",
    position: { x: 350, y: 80 },
    data: {
        label: "Booking Agent",
        agentType: "Worker",
        status: "success",
        description: "Finalizes the reservation.",
        agentReasoning: `**Search Results Analysis:**\nOption 1: Delta DL114 ($450) - **Best Match**`,
        duration: "1.5s",
    },
};

const searchTool: LineageNode = {
    id: "tool-search",
    type: "tool",
    parentId: "group-node_tool",
    extent: "parent",
    position: { x: 50, y: 50 },
    data: {
        label: "Flight Search Tool",
        toolName: "amadeus_flight_search",
        description: "Connects to GDS for flight availability.",
        category: "node_tool",
    },
};

const emailTool: LineageNode = {
    id: "tool-email",
    type: "tool",
    parentId: "group-node_tool",
    extent: "parent",
    position: { x: 350, y: 50 },
    data: {
        label: "Email Tool",
        toolName: "SendGridV3",
        description: "Sends transactional emails.",
        category: "node_tool",
    },
};

const sharedBrain: LineageNode = {
    id: "llm-shared",
    type: "llm",
    parentId: "group-llm_tool",
    extent: "parent",
    position: { x: 50, y: 50 }, // Will be centered by transformGraph
    data: {
        model: "gpt-4-turbo-preview",
        provider: "OpenAI",
        label: "Shared Brain",
        description: "Centralized reasoning capability.",
        status: "success",
        category: "llm_tool",
    },
};

const endNode: LineageNode = {
    id: "end-1",
    type: "end",
    position: { x: 1050, y: 180 }, // Approx
    data: {
        label: "Workflow End",
        status: "success",
        description: "Successful completion.",
    },
};

const edges: LineageEdge[] = [
    {
        id: "e-start-planner",
        source: "start-1",
        target: "agent-planner",
        sourceHandle: "right",
        targetHandle: "left",
        type: "sequence",
        animated: true,
        style: { stroke: "#94a3b8" },
        data: { stepNumber: 1 },
    },
    // Planner -> Brain
    {
        id: "e-planner-llm",
        source: "agent-planner",
        target: "llm-shared",
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "sequence",
        animated: true,
        style: { stroke: "#0e7490" },
        data: { stepNumber: 2 },
    },
    {
        id: "e-llm-planner",
        source: "llm-shared",
        target: "agent-planner",
        sourceHandle: "top-out",
        targetHandle: "bottom",
        type: "sequence",
        animated: true,
        style: { stroke: "#0e7490" },
        data: { stepNumber: 3 },
    },
    // Planner -> Search
    {
        id: "e-planner-search",
        source: "agent-planner",
        target: "tool-search",
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "sequence",
        animated: true,
        style: { stroke: "#3b82f6" },
        data: { stepNumber: 4 },
    },
    {
        id: "e-search-planner",
        source: "tool-search",
        target: "agent-planner",
        sourceHandle: "top-out",
        targetHandle: "bottom",
        type: "sequence",
        animated: true,
        style: { stroke: "#3b82f6" },
        data: { stepNumber: 5 },
    },
    // Planner -> Booking
    {
        id: "e-planner-booking",
        source: "agent-planner",
        target: "agent-booking",
        sourceHandle: "right",
        targetHandle: "left",
        type: "sequence",
        animated: true,
        style: { stroke: "#94a3b8" },
        data: { stepNumber: 6 },
    },
    // Booking -> Brain
    {
        id: "e-booking-llm",
        source: "agent-booking",
        target: "llm-shared",
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "sequence",
        animated: true,
        style: { stroke: "#0e7490" },
        data: { stepNumber: 7 },
    },
    {
        id: "e-llm-booking",
        source: "llm-shared",
        target: "agent-booking",
        sourceHandle: "top-out",
        targetHandle: "bottom",
        type: "sequence",
        animated: true,
        style: { stroke: "#0e7490" },
        data: { stepNumber: 8 },
    },
    // Booking -> Email
    {
        id: "e-booking-email",
        source: "agent-booking",
        target: "tool-email",
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "sequence",
        animated: true,
        style: { stroke: "#3b82f6" },
        data: { stepNumber: 9 },
    },
    // Booking -> End
    // (Missing edge in original file visualization logic?? No, SequenceEdge usually handles it)
    {
        id: "e-booking-end",
        source: "agent-booking",
        target: "end-1",
        sourceHandle: "right",
        targetHandle: "left",
        type: "sequence",
        animated: true,
        style: { stroke: "#94a3b8" },
        data: { stepNumber: 10 },
    },
];

export const flightWorkflowGraph = {
    nodes: [
        agentGroup,
        toolGroup,
        intelligenceGroup,
        startNode,
        plannerAgent,
        bookingAgent,
        searchTool,
        emailTool,
        sharedBrain,
        endNode,
    ],
    edges,
};
