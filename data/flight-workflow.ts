export const flightWorkflowGraph = {
    nodes: [
        {
            id: "start",
            type: "start_node",
            position: { x: 50, y: 300 },
            data: { label: "Claim Received" },
        },
        {
            id: "agent-1",
            type: "agent_node",
            position: { x: 250, y: 300 },
            data: {
                name: "Intake Agent",
                description: "Classifies email & extracts claim details",
                languageModal: {
                    modelName: "gpt-4-turbo",
                    provider: "OpenAI",
                },
                matchTools: [
                    {
                        toolName: "Email Parser",
                        description: "Extracts structured data",
                        usage: { subject: "Claim #1234" },
                        output: { claimId: "1234", type: "collision" },
                    },
                ],
            },
        },
        {
            id: "agent-2",
            type: "agent_node",
            position: { x: 650, y: 300 },
            data: {
                name: "Fraud Check Agent",
                description: "Analyzes risk factors",
                languageModal: {
                    modelName: "gpt-4-turbo", // Shared Brain
                    provider: "OpenAI",
                },
                matchTools: [
                    {
                        toolName: "Risk API",
                        description: "Checks fraud database",
                        usage: { claimId: "1234" },
                        output: { riskScore: 85, flag: "HIGH" },
                    },
                    {
                        toolName: "Policy DB",
                        description: "Verifies coverage",
                        usage: { policyId: "P-99" },
                        output: { active: true },
                    },
                ],
            },
        },
        {
            id: "agent-3",
            type: "agent_node",
            position: { x: 1050, y: 300 },
            data: {
                name: "Appraiser Agent",
                description: "Estimates damage costs",
                languageModal: {
                    modelName: "gpt-4-turbo", // Shared Brain
                    provider: "OpenAI",
                },
            },
        },
        {
            id: "agent-4",
            type: "agent_node",
            position: { x: 1450, y: 300 },
            data: {
                name: "Finalizer Agent",
                description: "Generates approval/rejection",
                languageModal: {
                    modelName: "claude-3-opus",
                    provider: "Anthropic",
                },
            },
        },
        {
            id: "end",
            type: "end_node",
            position: { x: 1750, y: 300 },
            data: { label: "Process Complete" },
        },
    ],
    edges: [
        { source: "start", target: "agent-1" },
        { source: "agent-1", target: "agent-2" },
        { source: "agent-2", target: "agent-3" },
        { source: "agent-3", target: "agent-4" },
        { source: "agent-4", target: "end" },
    ],
};
