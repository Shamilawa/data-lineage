import { LineageNode, LineageEdge } from "@/types/lineage";

// --- Enterprise Market Intelligence & Risk Analysis System ---

// Nodes
const startNode: LineageNode = {
    id: "start-market",
    type: "start",
    position: { x: 50, y: 300 },
    data: {
        label: "Market Signal",
        description:
            "Triggered by scheduled interval or significant market event.",
        status: "success",
    },
};

const supervisorNode: LineageNode = {
    id: "agent-supervisor",
    type: "agent",
    parentId: "group-orchestrator",
    extent: "parent",
    position: { x: 50, y: 50 },
    data: {
        label: "Supervisor Agent",
        description:
            "Orchestrates the analysis pipeline, delegating to specialized agents.",
        status: "active",
        agentType: "Orchestrator",
    },
};

// --- Specialized Agents ---
const ingestionAgent: LineageNode = {
    id: "agent-ingestion",
    type: "agent",
    parentId: "group-agents", // Grouping
    extent: "parent",
    position: { x: 50, y: 50 },
    data: {
        label: "Data Ingestion Agent",
        agentType: "Specialist",
        status: "success",
        description: "Fetches raw data.",
    },
};

const enrichmentAgent: LineageNode = {
    id: "agent-enrichment",
    type: "agent",
    parentId: "group-agents",
    extent: "parent",
    position: { x: 350, y: 50 },
    data: {
        label: "Enrichment Agent",
        agentType: "Specialist",
        status: "success",
        description: "Cleans & embeds data.",
    },
};

const analysisAgent: LineageNode = {
    id: "agent-analysis",
    type: "agent",
    parentId: "group-agents",
    extent: "parent",
    position: { x: 650, y: 50 },
    data: {
        label: "Intelligence Analyst",
        agentType: "Reasoning",
        status: "active",
        description: "Finds patterns.",
    },
};

const riskAgent: LineageNode = {
    id: "agent-risk",
    type: "agent",
    parentId: "group-agents",
    extent: "parent",
    position: { x: 950, y: 50 },
    data: {
        label: "Risk Evaluator",
        agentType: "Reasoning",
        status: "idle",
        description: "Assesses risk.",
    },
};

const synthesisAgent: LineageNode = {
    id: "agent-synthesis",
    type: "agent",
    parentId: "group-agents",
    extent: "parent",
    position: { x: 1250, y: 50 },
    data: {
        label: "Synthesis Agent",
        agentType: "Writer",
        status: "idle",
        description: "Format report.",
    },
};

// --- Tools & Data Stores ---

const toolApiFin: LineageNode = {
    id: "tool-api-finance",
    type: "tool",
    parentId: "group-tools",
    extent: "parent",
    position: { x: 50, y: 50 },
    data: {
        label: "Market Data API",
        toolName: "Bloomberg_API_v2",
        description: "Real-time feeds.",
        category: "API",
    },
};

const toolMcp: LineageNode = {
    id: "tool-mcp-news",
    type: "tool",
    parentId: "group-tools",
    extent: "parent",
    position: { x: 50, y: 200 },
    data: {
        label: "News Feed MCP",
        toolName: "MCP_News_Server",
        description: "External intelligence.",
        category: "MCP",
    },
};

const dbAnalytics: LineageNode = {
    id: "store-analytics",
    type: "data-store",
    parentId: "group-tools",
    extent: "parent",
    position: { x: 350, y: 50 },
    data: {
        label: "Analytics DB",
        toolName: "Snowflake_DB",
        description: "Historical data.",
        category: "Database",
    },
};

const dbVector: LineageNode = {
    id: "store-vector",
    type: "data-store",
    parentId: "group-tools",
    extent: "parent",
    position: { x: 650, y: 50 },
    data: {
        label: "Vector Store",
        toolName: "Pinecone_V3",
        description: "Embeddings & RAG.",
        category: "Vector DB",
    },
};

// --- Intelligence ---
const llmGpt: LineageNode = {
    id: "llm-gpt4",
    type: "llm",
    parentId: "group-intelligence",
    extent: "parent",
    position: { x: 400, y: 50 },
    data: {
        label: "GPT-4 Turbo",
        model: "gpt-4-turbo",
        provider: "OpenAI",
        description: "General reasoning.",
    },
};

const llmClaude: LineageNode = {
    id: "llm-claude",
    type: "llm",
    parentId: "group-intelligence",
    extent: "parent",
    position: { x: 800, y: 50 },
    data: {
        label: "Claude 3 Opus",
        model: "claude-3-opus",
        provider: "Anthropic",
        description: "Complex analysis.",
    },
};

const endNode: LineageNode = {
    id: "end-market",
    type: "end",
    position: { x: 1900, y: 300 },
    data: { label: "Report Generated", status: "idle" },
};

// --- Groups (Visual Containers) ---

const orchestratorGroup: LineageNode = {
    id: "group-orchestrator",
    type: "group",
    position: { x: 600, y: 50 },
    style: { width: 400, height: 200 },
    data: { label: "Orchestrator", color: "#f59e0b" },
};

const agentGroup: LineageNode = {
    id: "group-agents",
    type: "group",
    position: { x: 600, y: 350 }, // Shifted down
    style: { width: 1600, height: 250 },
    data: { label: "Agents", color: "#3b82f6" },
};

const toolGroup: LineageNode = {
    id: "group-tools",
    type: "group",
    position: { x: 600, y: 700 }, // Shifted down
    style: { width: 1600, height: 350 },
    data: { label: "Tools & Data Stores", color: "#64748b" },
};

const intelligenceGroup: LineageNode = {
    id: "group-intelligence",
    type: "group",
    position: { x: 600, y: 1100 }, // Shifted down
    style: { width: 1600, height: 200 },
    data: { label: "Intelligence Sources", color: "#0e7490" },
};

// --- Edges ---
// --- Edges ---
const edges: LineageEdge[] = [
    // Start -> Supervisor
    {
        id: "e1",
        source: "start-market",
        target: "agent-supervisor",
        type: "sequence",
        animated: true,
        data: { stepNumber: 1 },
        targetHandle: "left",
    },

    // Supervisor Orchestration (Supervisor -> Ingestion)
    {
        id: "e2",
        source: "agent-supervisor",
        target: "agent-ingestion",
        type: "sequence",
        label: "Delegate: Fetch Data",
        data: { stepNumber: 2 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Ingestion -> Tools (Sequential)
    {
        id: "e6",
        source: "agent-ingestion",
        target: "tool-api-finance",
        type: "sequence",
        data: { stepNumber: 3 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e8",
        source: "tool-api-finance",
        target: "agent-ingestion",
        type: "sequence",
        animated: true,
        data: { stepNumber: 4 },
        sourceHandle: "top-out",
        targetHandle: "left",
    },
    {
        id: "e7",
        source: "agent-ingestion",
        target: "tool-mcp-news",
        type: "sequence",
        data: { stepNumber: 5 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e9",
        source: "tool-mcp-news",
        target: "agent-ingestion",
        type: "sequence",
        animated: true,
        data: { stepNumber: 6 },
        sourceHandle: "top-out",
        targetHandle: "left",
    },

    // Ingestion -> Supervisor (Return)
    {
        id: "e3",
        source: "agent-ingestion",
        target: "agent-supervisor",
        type: "sequence",
        label: "Raw Data",
        data: { stepNumber: 7 },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Supervisor -> Enrichment
    {
        id: "e4",
        source: "agent-supervisor",
        target: "agent-enrichment",
        type: "sequence",
        label: "Delegate: Enrich",
        data: { stepNumber: 8 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Enrichment -> Vector DB
    {
        id: "e10",
        source: "agent-enrichment",
        target: "store-vector",
        type: "sequence",
        label: "Upsert Vectors",
        data: { stepNumber: 9 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Enrichment -> Supervisor
    {
        id: "e5",
        source: "agent-enrichment",
        target: "agent-supervisor",
        type: "sequence",
        label: "Enriched Data",
        data: { stepNumber: 10 },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Supervisor -> Analysis
    {
        id: "e11",
        source: "agent-supervisor",
        target: "agent-analysis",
        type: "sequence",
        label: "Delegate: Analyze",
        data: { stepNumber: 11 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Analysis -> Vector DB (RAG)
    {
        id: "e12",
        source: "agent-analysis",
        target: "store-vector",
        type: "sequence",
        label: "Query Context",
        data: { stepNumber: 12 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e13",
        source: "store-vector",
        target: "agent-analysis",
        type: "sequence",
        animated: true,
        data: { stepNumber: 13 },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Analysis -> LLM
    {
        id: "e14",
        source: "agent-analysis",
        target: "llm-gpt4",
        type: "sequence",
        data: { stepNumber: 14 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e15",
        source: "llm-gpt4",
        target: "agent-analysis",
        type: "sequence",
        animated: true,
        data: { stepNumber: 15 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Analysis -> Supervisor
    {
        id: "e16",
        source: "agent-analysis",
        target: "agent-supervisor",
        type: "sequence",
        label: "Insights",
        data: { stepNumber: 16 },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Supervisor -> Risk
    {
        id: "e17",
        source: "agent-supervisor",
        target: "agent-risk",
        type: "sequence",
        label: "Delegate: Assess Risk",
        data: { stepNumber: 17 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Risk -> LLM (Claude)
    {
        id: "e18",
        source: "agent-risk",
        target: "llm-claude",
        type: "sequence",
        data: { stepNumber: 18 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e19",
        source: "llm-claude",
        target: "agent-risk",
        type: "sequence",
        animated: true,
        data: { stepNumber: 19 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Risk -> Supervisor
    {
        id: "e20",
        source: "agent-risk",
        target: "agent-supervisor",
        type: "sequence",
        label: "Risk Score",
        data: { stepNumber: 20 },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Supervisor -> Synthesis
    {
        id: "e21",
        source: "agent-supervisor",
        target: "agent-synthesis",
        type: "sequence",
        label: "Delegate: Report",
        data: { stepNumber: 21 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Synthesis -> Analytics DB (Save Report)
    {
        id: "e22",
        source: "agent-synthesis",
        target: "store-analytics",
        type: "sequence",
        label: "Save Report",
        data: { stepNumber: 22 },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Synthesis -> Supervisor
    {
        id: "e23",
        source: "agent-synthesis",
        target: "agent-supervisor",
        type: "sequence",
        label: "Done",
        data: { stepNumber: 23 },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Supervisor -> End
    {
        id: "e24",
        source: "agent-supervisor",
        target: "end-market",
        type: "sequence",
        animated: true,
        data: { stepNumber: 24 },
        sourceHandle: "right",
        targetHandle: "left",
    },
];

export const marketIntelligenceWorkflow = {
    nodes: [
        startNode,
        orchestratorGroup, // Added
        supervisorNode,
        agentGroup,
        toolGroup,
        intelligenceGroup,
        ingestionAgent,
        enrichmentAgent,
        analysisAgent,
        riskAgent,
        synthesisAgent,
        toolApiFin,
        toolMcp,
        dbAnalytics,
        dbVector,
        llmGpt,
        llmClaude,
        endNode,
    ],
    edges,
};
