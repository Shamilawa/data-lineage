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
        interactions: [
            {
                title: "Delegate: Fetch Data",
                withNode: "Data Ingestion Agent",
                input: {
                    task: "FETCH_INTELLIGENCE",
                    target_entity: "TechGlobal Inc.",
                    context: "Quantum Processor Facility, Southeast Asia",
                    priority: "HIGH",
                },
                inputSummary:
                    "Directive: specific data collection for TechGlobal's new facility in SE Asia.",
                output: {
                    status: "DELEGATED",
                    assigned_to: "agent-ingestion",
                    tracking_id: "job-8821",
                },
                outputSummary:
                    "Task accepted. Job #8821 initiated by Ingestion Agent.",
            },
            {
                title: "Delegate: Enrich Data",
                withNode: "Enrichment Agent",
                input: {
                    task: "ENRICH_ENTITIES",
                    source_data_id: "dataset-raw-445",
                    required_context: ["Geopolitical", "Supply Chain"],
                },
                output: {
                    status: "DELEGATED",
                    assigned_to: "agent-enrichment",
                    tracking_id: "job-8822",
                },
            },
            {
                title: "Delegate: Risk Analysis",
                withNode: "Intelligence Analyst",
                input: {
                    task: "ANALYZE_RISK",
                    enriched_data_id: "dataset-enriched-992",
                    focus: "Political Instability & Vendor Reliability",
                },
                output: {
                    status: "DELEGATED",
                    assigned_to: "agent-analysis",
                    tracking_id: "job-8823",
                },
            },
            {
                title: "Delegate: Synthesis",
                withNode: "Synthesis Agent",
                input: {
                    task: "GENERATE_REPORT",
                    findings_id: "analysis-results-112",
                    format: "EXECUTIVE_BRIEF",
                },
                output: {
                    status: "DELEGATED",
                    assigned_to: "agent-synthesis",
                    tracking_id: "job-8824",
                },
            },
        ],
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
        interactions: [
            {
                title: "Tool Call: Market Data API",
                withNode: "Market Data API",
                input: {
                    endpoint: "/v2/markets/volatility",
                    tickers: ["TGLB (TechGlobal)"],
                    region: "APAC",
                },
                inputSummary:
                    "Querying live market volatility index for TechGlobal (TGLB) in APAC region.",
                output: {
                    volatility_index: "MEDIUM-HIGH",
                    recent_filings: [
                        {
                            type: "8-K",
                            date: "2024-03-15",
                            summary: "Supply chain adjustment in Vietnam",
                        },
                    ],
                },
                outputSummary:
                    "Result: MEDIUM-HIGH volatility. Recent 8-K filing indicates supply chain adjustments in Vietnam.",
            },
            {
                title: "Tool Call: News Feed MCP",
                withNode: "News Feed MCP",
                input: {
                    query: "TechGlobal AND (Vietnam OR Thailand) AND Quantum",
                    days: 30,
                    source_type: "tier-1-news",
                },
                output: {
                    article_count: 14,
                    top_headlines: [
                        "TechGlobal breaks ground on Da Nang Quantum Hub",
                        "Regional tensions rise over critical tech exports",
                    ],
                },
            },
        ],
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
        interactions: [
            {
                title: "Vector Store: Retrieve Context",
                withNode: "Vector Store",
                input: {
                    query_vector: [0.12, -0.45, 0.88, "..."],
                    namespace: "geopolitical-risks-2024",
                    top_k: 3,
                },
                output: {
                    matches: [
                        {
                            id: "risk-profile-vn",
                            score: 0.92,
                            metadata: {
                                risk_level: "Medium",
                                type: "Political",
                            },
                        },
                        {
                            id: "supply-shock-semi",
                            score: 0.85,
                            metadata: {
                                impact: "High",
                                sector: "Semiconductors",
                            },
                        },
                    ],
                },
            },
        ],
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
        interactions: [
            {
                title: "LLM Reasoning: Pattern Match",
                withNode: "GPT-4 Turbo",
                input: {
                    system: "You are a senior intelligence analyst.",
                    context: "Recent news indicates rising tensions...",
                    task: "Identify correlation between facility location and regional stability.",
                },
                inputSummary:
                    "Analyzing correlation between new facility location and reported regional instability events.",
                output: {
                    finding: "Correlation Found",
                    confidence: "High",
                    reasoning:
                        "Facility is located in a zone with increasing maritime disputes. Supply routes traverse contested waters.",
                },
                outputSummary:
                    "ALERT: High confidence correlation found. Facility is in a disputed maritime zone with threatened supply routes.",
            },
        ],
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
        interactions: [
            {
                title: "LLM Reasoning: Score Calculation",
                withNode: "Claude 3 Opus",
                input: {
                    factors: [
                        { category: "Geopolitical", severity: 7 },
                        { category: "Supply Chain", severity: 9 },
                        { category: "Regulatory", severity: 4 },
                    ],
                    weighting_model: "corporate-standard-v4",
                },
                inputSummary:
                    "Calculating weighted risk score. Key factors: Supply Chain (9/10) and Geopolitics (7/10).",
                output: {
                    final_score: 8.2,
                    risk_tier: "CRITICAL",
                    recommendation:
                        "Establish redundant logistics immediately.",
                },
                outputSummary:
                    "CRITICAL RISK DETECTED (Score: 8.2/10). Recommendation: Establish redundant logistics immediately.",
            },
        ],
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
        interactions: [
            {
                title: "Database: Audit Log",
                withNode: "Analytics DB",
                input: {
                    action: "SAVE_REPORT",
                    report_id: "rep-2024-Q2-TGLB",
                    access_level: "RESTRICTED",
                },
                output: {
                    db_id: 102938,
                    timestamp: "2024-06-15T14:30:00Z",
                },
            },
        ],
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
        interactions: [
            {
                title: "API Request: Volatility Check",
                withNode: "Data Ingestion Agent",
                input: {
                    method: "GET",
                    path: "/v2/markets/volatility",
                    headers: { Authorization: "Bearer ***" },
                    query_params: { region: "APAC", sector: "Technology" },
                },
                output: {
                    status: 200,
                    body: {
                        volatility_index: 0.78,
                        trend: "UPWARD",
                        timestamp: "2024-06-15T10:00:00Z",
                    },
                },
            },
        ],
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
        interactions: [
            {
                title: "MCP Query: News Search",
                withNode: "Data Ingestion Agent",
                input: {
                    jsonrpc: "2.0",
                    method: "search_news",
                    params: {
                        query: "TechGlobal AND (Vietnam OR Thailand)",
                        topics: ["Geopolitics", "Supply Chain"],
                        limit: 50,
                    },
                },
                output: {
                    result: {
                        count: 14,
                        articles: [
                            {
                                title: "TechGlobal breaks ground on Da Nang Quantum Hub",
                                source: "Reuters",
                                date: "2024-05-12",
                            },
                            {
                                title: "Regional tensions rise over critical tech exports",
                                source: "Bloomberg",
                                date: "2024-06-01",
                            },
                        ],
                    },
                },
            },
        ],
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
        interactions: [
            {
                title: "SQL Operation: Insert Report",
                withNode: "Synthesis Agent",
                input: {
                    sql: "INSERT INTO reports (title, type, generated_at, content_url) VALUES (?, ?, ?, ?)",
                    params: [
                        "TechGlobal Risk Assessment",
                        "Risk Brief",
                        "NOW()",
                        "https://...",
                    ],
                },
                output: {
                    affected_rows: 1,
                    insert_id: 102938,
                    execution_time_ms: 45,
                },
            },
        ],
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
        interactions: [
            {
                title: "Vector Upsert",
                withNode: "Enrichment Agent",
                input: {
                    operation: "upsert",
                    namespace: "market-risks",
                    vectors: [
                        {
                            id: "v_102",
                            values: [0.1, 0.2, "..."],
                            metadata: { source: "reuters" },
                        },
                        {
                            id: "v_103",
                            values: [0.3, 0.1, "..."],
                            metadata: { source: "bloomberg" },
                        },
                    ],
                },
                output: {
                    upserted_count: 2,
                    status: "success",
                },
            },
            {
                title: "Vector Query (RAG)",
                withNode: "Intelligence Analyst",
                input: {
                    operation: "query",
                    vector: [0.23, -0.11, 0.44],
                    top_k: 5,
                    include_metadata: true,
                },
                output: {
                    matches: [
                        {
                            id: "doc-552",
                            score: 0.95,
                            metadata: {
                                text: "Semiconductor supply chain vulnerability...",
                            },
                        },
                        {
                            id: "doc-112",
                            score: 0.88,
                            metadata: {
                                text: "Vietnam port infrastructure...",
                            },
                        },
                    ],
                },
            },
        ],
    },
};

// --- Intelligence ---
const llmGpt: LineageNode = {
    id: "llm-gpt4",
    type: "llm",
    parentId: "group-intelligence",
    extent: "parent",
    position: { x: 50, y: 50 },
    data: {
        label: "GPT-4 Turbo",
        model: "gpt-4-turbo",
        provider: "OpenAI",
        description: "General reasoning.",
        interactions: [
            {
                title: "LLM Completion: Correlation Analysis",
                withNode: "Intelligence Analyst",
                input: {
                    messages: [
                        {
                            role: "system",
                            content: "You are a senior intelligence analyst.",
                        },
                        {
                            role: "user",
                            content:
                                "Analyze correlation between retrieved docs and TechGlobal facility.",
                        },
                    ],
                    temperature: 0.2,
                },
                output: {
                    content:
                        "There is a high correlation. The new facility is located in a region flagged for logistical bottlenecks...",
                    usage: {
                        prompt_tokens: 450,
                        completion_tokens: 120,
                        total: 570,
                    },
                },
            },
        ],
    },
};

const llmClaude: LineageNode = {
    id: "llm-claude",
    type: "llm",
    parentId: "group-intelligence",
    extent: "parent",
    position: { x: 450, y: 50 },
    data: {
        label: "Claude 3 Opus",
        model: "claude-3-opus",
        provider: "Anthropic",
        description: "Complex analysis.",
        interactions: [
            {
                title: "LLM Completion: Risk Scoring",
                withNode: "Risk Evaluator",
                input: {
                    messages: [
                        {
                            role: "user",
                            content:
                                "Calculate risk score (0-10) for 4-week supply delay...",
                        },
                    ],
                    max_tokens: 1000,
                },
                output: {
                    content:
                        '{\n  "score": 8.5,\n  "risk_level": "CRITICAL",\n  "reasoning": "Semiconductor industry operates on JIT. 4 weeks is catastrophic."\n}',
                    stop_reason: "end_turn",
                },
            },
        ],
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
    position: { x: 600, y: 500 }, // Shifted down for more space
    style: { width: 1600, height: 250 },
    data: { label: "Agents", color: "#3b82f6" },
};

const toolGroup: LineageNode = {
    id: "group-tools",
    type: "group",
    position: { x: 600, y: 1000 }, // Shifted down for more space
    style: { width: 1600, height: 350 },
    data: { label: "Tools & Data Stores", color: "#64748b" },
};

const intelligenceGroup: LineageNode = {
    id: "group-intelligence",
    type: "group",
    position: { x: 600, y: 1600 }, // Shifted down for more space
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
        data: {
            stepNumber: 1,
            payload: {
                trigger: "USER_REQUEST",
                user: "Analyst_04",
                query: "Assess geopolitical and supply chain risks for 'TechGlobal Inc.' related to their new quantum processor facility in Southeast Asia.",
                parameters: { depth: "DEEP", urgency: "HIGH" },
            },
        },
        targetHandle: "left",
    },

    // Supervisor Orchestration (Supervisor -> Ingestion)
    {
        id: "e2",
        source: "agent-supervisor",
        target: "agent-ingestion",
        type: "sequence",
        label: "Delegate: Fetch Data",
        data: {
            stepNumber: 2,
            payload: {
                task_id: "job-8821",
                directive: "FETCH_RAW_INTELLIGENCE",
                targets: [
                    "TechGlobal Inc.",
                    "Quantum Processors",
                    "Vietnam",
                    "Thailand",
                ],
                sources: ["MarketAPI", "NewsFeed"],
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Ingestion -> Tools (Sequential)
    {
        id: "e6",
        source: "agent-ingestion",
        target: "tool-api-finance",
        type: "sequence",
        data: {
            stepNumber: 3,
            payload: {
                api_call: "GET /v2/markets/volatility",
                params: { region: "APAC", sector: "Technology" },
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e8",
        source: "tool-api-finance",
        target: "agent-ingestion",
        type: "sequence",
        animated: true,
        data: {
            stepNumber: 4,
            payload: {
                status: 200,
                data: { volatility_index: 0.78, trend: "UPWARD" },
            },
        },
        sourceHandle: "top-out",
        targetHandle: "left",
    },
    {
        id: "e7",
        source: "agent-ingestion",
        target: "tool-mcp-news",
        type: "sequence",
        data: {
            stepNumber: 5,
            payload: {
                mcp_query:
                    "SELECT headlines FROM news WHERE entities IN ('TechGlobal') AND topic = 'Geopolitics'",
                limit: 50,
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e9",
        source: "tool-mcp-news",
        target: "agent-ingestion",
        type: "sequence",
        animated: true,
        data: {
            stepNumber: 6,
            payload: {
                articles_found: 14,
                top_source: "Reuters",
                sentiment_score: -0.4,
            },
        },
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
        data: {
            stepNumber: 7,
            payload: {
                job_id: "job-8821",
                status: "COMPLETED",
                data_points_collected: 1450,
                storage_ref: "s3://raw-intel/batch-992",
            },
        },
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
        data: {
            stepNumber: 8,
            payload: {
                task_id: "job-8822",
                directive: "ENRICH_ENTITIES",
                input_ref: "s3://raw-intel/batch-992",
                requirements: ["Entity Resolution", "Vector Embedding"],
            },
        },
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
        data: {
            stepNumber: 9,
            payload: {
                operation: "UPSERT",
                vectors: ["v_102", "v_103", "v_104"],
                namespace: "market-risks",
            },
        },
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
        data: {
            stepNumber: 10,
            payload: {
                job_id: "job-8822",
                status: "COMPLETED",
                entities_resolved: 45,
                embeddings_generated: 120,
            },
        },
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
        data: {
            stepNumber: 11,
            payload: {
                task_id: "job-8823",
                directive: "ANALYZE_PATTERNS",
                focus_areas: [
                    "Supply Chain Disruption",
                    "Regional Instability",
                ],
            },
        },
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
        data: {
            stepNumber: 12,
            payload: {
                operation: "QUERY",
                vector: [0.23, -0.11, 0.44],
                top_k: 5,
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e13",
        source: "store-vector",
        target: "agent-analysis",
        type: "sequence",
        animated: true,
        data: {
            stepNumber: 13,
            payload: {
                matches: [
                    {
                        id: "doc-552",
                        score: 0.95,
                        text: "Semiconductor supply chain vulnerability...",
                    },
                    {
                        id: "doc-112",
                        score: 0.88,
                        text: "Vietnam port infrastructure...",
                    },
                ],
            },
        },
        sourceHandle: "right",
        targetHandle: "top",
    },

    // Analysis -> LLM
    {
        id: "e14",
        source: "agent-analysis",
        target: "llm-gpt4",
        type: "sequence",
        data: {
            stepNumber: 14,
            payload: {
                role: "system",
                content:
                    "Analyze the correlation between the retrieved documents and the target entity 'TechGlobal'.",
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e15",
        source: "llm-gpt4",
        target: "agent-analysis",
        type: "sequence",
        animated: true,
        data: {
            stepNumber: 15,
            payload: {
                role: "assistant",
                content:
                    "There is a high correlation. The new facility is located in a region flagged for logistical bottlenecks...",
            },
        },
        sourceHandle: "bottom", // LLM generic handle
        targetHandle: "top",
    },

    // Analysis -> Supervisor
    {
        id: "e16",
        source: "agent-analysis",
        target: "agent-supervisor",
        type: "sequence",
        label: "Insights",
        data: {
            stepNumber: 16,
            payload: {
                job_id: "job-8823",
                status: "COMPLETED",
                key_finding:
                    "High probability of supply delay (>4 weeks) due to regional infrastructure limits.",
            },
        },
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
        data: {
            stepNumber: 17,
            payload: {
                task_id: "job-8824",
                directive: "CALCULATE_RISK_SCORE",
                input_finding: "Supply delay > 4 weeks",
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },

    // Risk -> LLM (Claude)
    {
        id: "e18",
        source: "agent-risk",
        target: "llm-claude",
        type: "sequence",
        data: {
            stepNumber: 18,
            payload: {
                prompt: "Calculate risk score (0-10) for 4-week supply delay in semiconductor sector. Return JSON.",
            },
        },
        sourceHandle: "bottom",
        targetHandle: "top",
    },
    {
        id: "e19",
        source: "llm-claude",
        target: "agent-risk",
        type: "sequence",
        animated: true,
        data: {
            stepNumber: 19,
            payload: {
                score: 8.5,
                risk_level: "CRITICAL",
                reasoning:
                    "Semiconductor industry operates on JIT. 4 weeks is catastrophic.",
            },
        },
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
        data: {
            stepNumber: 20,
            payload: {
                job_id: "job-8824",
                risk_score: 8.5, // 0-10
                severity: "CRITICAL",
            },
        },
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
        data: {
            stepNumber: 21,
            payload: {
                task_id: "job-8825",
                directive: "COMPILE_REPORT",
                sections: ["Executive Summary", "Key Risks", "Data Sources"],
            },
        },
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
        data: {
            stepNumber: 22,
            payload: {
                operation: "INSERT",
                table: "reports",
                data: {
                    title: "TechGlobal Risk Assessment",
                    date: "2024-06-15",
                },
            },
        },
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
        data: {
            stepNumber: 23,
            payload: {
                job_id: "job-8825",
                status: "PUBLISHED",
                report_url: "https://internal.portal/reports/8825",
            },
        },
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
        data: {
            stepNumber: 24,
            payload: {
                final_status: "SUCCESS",
                execution_time: "4500ms",
            },
        },
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
