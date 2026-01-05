export const rawGraph = {
    nodes: [
        {
            id: "start_node-1",
            data: { label: "Start Claim" },
            type: "start_node",
            position: { x: 100, y: 300 },
        },
        // 1. Intake Agent
        {
            id: "agent_node-1",
            data: {
                name: "Intake Agent",
                label: "Agent",
                description: "Analyzes initial claim report and policy.",
                prompt: {
                    id: "p1",
                    name: "Claim Classification Prompt",
                    configurations: {
                        prompt_template: "Analyze the claim details...",
                    },
                },
                languageModal: {
                    provider: "OpenAI",
                    modelName: "Brain",
                },
                matchTools: [
                    {
                        toolName: "PolicyDB",
                        description: "Fetch policy details",
                        usage: { query: "SELECT * FROM policies WHERE id=..." },
                        output: { coverage: "Full", deductible: 500 },
                    },
                ],
            },
            type: "agent_node",
            position: { x: 300, y: 250 },
        },
        // 2. Fraud Check Agent
        {
            id: "agent_node-2",
            data: {
                name: "Fraud Check Agent",
                label: "Agent",
                description: "Checks claim against historical fraud patterns.",
                prompt: {
                    id: "p2",
                    name: "Fraud Analysis Prompt",
                    configurations: {
                        prompt_template: "Evaluate risk score...",
                    },
                },
                languageModal: {
                    provider: "OpenAI",
                    modelName: "Brain",
                },
                matchTools: [
                    {
                        toolName: "RiskScoreAPI",
                        description: "Get fraud risk score",
                        usage: { claimantId: "USER_123" },
                        output: { riskScore: 12, level: "Low" },
                    },
                ],
            },
            type: "agent_node",
            position: { x: 500, y: 250 },
        },
        // 3. Appraiser Agent
        {
            id: "agent_node-3",
            data: {
                name: "Appraiser Agent",
                label: "Agent",
                description: "Estimates repair costs based on photos.",
                prompt: {
                    id: "p3",
                    name: "Damage Estimation Prompt",
                    configurations: {
                        prompt_template: "Estimate repair cost...",
                    },
                },
                languageModal: {
                    provider: "OpenAI",
                    modelName: "Brain",
                },
                matchTools: [
                    {
                        toolName: "MarketValueAPI",
                        description: "Get current parts pricing",
                        usage: { parts: ["bumper", "headlight"] },
                        output: { totalEstimate: 1250.0 },
                    },
                ],
            },
            type: "agent_node",
            position: { x: 700, y: 250 },
        },
        // 4. Finalizer Agent
        {
            id: "agent_node-4",
            data: {
                name: "Finalizer Agent",
                label: "Agent",
                description: "Generates approval and sends notification.",
                prompt: {
                    id: "p4",
                    name: "Approval Decision Prompt",
                    configurations: {
                        prompt_template: "Draft approval email...",
                    },
                },
                languageModal: {
                    provider: "OpenAI",
                    modelName: "Brain",
                },
                matchTools: [
                    {
                        toolName: "EmailService",
                        description: "Send notification",
                        usage: { recipient: "customer@example.com" },
                        output: {
                            status: "Sent",
                            timestamp: "2024-01-01T10:00:00Z",
                        },
                    },
                ],
            },
            type: "agent_node",
            position: { x: 900, y: 250 },
        },
        {
            id: "end_node-1",
            data: { label: "Claim Processed" },
            type: "end_node",
            position: { x: 1100, y: 300 },
        },
    ],
    edges: [
        { id: "e1", source: "start_node-1", target: "agent_node-1" },
        { id: "e2", source: "agent_node-1", target: "agent_node-2" },
        { id: "e3", source: "agent_node-2", target: "agent_node-3" },
        { id: "e4", source: "agent_node-3", target: "agent_node-4" },
        { id: "e5", source: "agent_node-4", target: "end_node-1" },
    ],
};
