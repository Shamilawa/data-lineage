import { Node, Edge } from "reactflow";
import {
    AgentNodeData,
    LLMNodeData,
    PromptNodeData,
    SequenceEdgeData,
} from "@/types/lineage";

// Layout coordinates (approximated from sketch)
export const initialNodes: Node[] = [
    {
        id: "start",
        type: "start",
        position: { x: 50, y: 250 },
        data: {
            label: "Start",
            timestamp: "10:00:01 AM",
            status: "success",
            outputs: {
                userQuery: "Find flights to Paris for next weekend under $600",
            },
        },
    },
    {
        id: "agent-triage",
        type: "agent",
        position: { x: 300, y: 200 },
        data: {
            label: "Intent Triage Agent",
            agentType: "Router",
            status: "success",
            duration: "1.2s",
            inputs: {
                query: "Find flights to Paris for next weekend under $600",
            },
            outputs: {
                intent: "flight_search",
                confidence: 0.98,
                routedTo: "agent-flight",
            },
        },
    },
    {
        id: "prompt-triage",
        type: "prompt",
        position: { x: 750, y: 50 },
        data: {
            label: "Intent Triage Prompt",
            outputs: {
                template:
                    "You are a triage agent. Classify the following user query: {{query}}...",
            },
        },
    },
    {
        id: "llm",
        type: "llm",
        position: { x: 800, y: 250 },
        data: {
            model: "GPT 4o mini",
            tokens: 156,
            cost: 0.0012,
            status: "success",
            inputs: {
                messages: [
                    { role: "system", content: "You are a triage agent..." },
                    { role: "user", content: "Find flights to Paris..." },
                ],
            },
            outputs: {
                content: '{"intent": "flight_search"}',
            },
        },
    },
    {
        id: "agent-flight",
        type: "agent",
        position: { x: 300, y: 500 },
        data: {
            label: "Flight Search Agent",
            agentType: "Worker",
            status: "active",
            duration: "Running...",
            inputs: {
                intent: "flight_search",
                destination: "Paris",
                price_limit: 600,
            },
            outputs: {
                pending: true,
            },
        },
    },
    {
        id: "prompt-flight",
        type: "prompt",
        position: { x: 800, y: 550 },
        data: {
            label: "Flight Search Prompt",
            outputs: {
                template:
                    "Search for flights to {{destination}} under {{price}}...",
            },
        },
    },
];

export const initialEdges: Edge[] = [
    // 1. Start -> Triage
    {
        id: "e1",
        source: "start",
        target: "agent-triage",
        type: "sequence",
        animated: true,
        data: { stepNumber: 1 },
        style: { stroke: "#94a3b8" },
    },
    // 2. Triage -> LLM
    {
        id: "e2",
        source: "agent-triage",
        target: "llm",
        type: "sequence",
        animated: true,
        data: { stepNumber: 2 },
        style: { stroke: "#94a3b8" },
    },
    // 3. Triage Prompt -> LLM
    {
        id: "e3",
        source: "prompt-triage",
        target: "llm",
        sourceHandle: "left-source",
        type: "sequence",
        animated: false,
        data: { stepNumber: 3 },
        style: { stroke: "#d97706", strokeDasharray: "5,5" },
    },
    // 4. LLM -> Triage (Response)
    {
        id: "e4",
        source: "llm",
        target: "agent-triage",
        sourceHandle: "top",
        targetHandle: "top",
        type: "sequence",
        animated: true,
        data: { stepNumber: 4 },
        style: { stroke: "#a855f7" },
    },
    // 5. Triage -> Flight Agent
    {
        id: "e5",
        source: "agent-triage",
        target: "agent-flight",
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "sequence",
        animated: true,
        data: { stepNumber: 5 },
        style: { stroke: "#94a3b8" },
    },
    // 6. Flight Agent -> LLM
    {
        id: "e6",
        source: "agent-flight",
        target: "llm",
        type: "sequence",
        animated: true,
        data: { stepNumber: 6 },
        style: { stroke: "#94a3b8" },
    },
    // 7. Flight Prompt -> LLM (Inferred)
    {
        id: "e7",
        source: "prompt-flight",
        target: "llm",
        type: "sequence",
        animated: false,
        data: { stepNumber: 7 },
        style: { stroke: "#d97706", strokeDasharray: "5,5" },
    },
];
