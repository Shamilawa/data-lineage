import { Node, Edge } from "reactflow";

export type LineageNodeType =
    | "start"
    | "end"
    | "agent"
    | "llm"
    | "prompt"
    | "tool"
    | "supervisor"
    | "data-store";

export interface BaseNodeData {
    label: string;
    description?: string;
    agentReasoning?: string;
    xaiTimeline?: Array<{
        title: string;
        type: "input" | "output" | "tool" | "llm" | "processing";
        content: string;
    }>;
    interactions?: Array<{
        title: string;
        withNode?: string;
        input: any;
        inputSummary?: string;
        output: any;
        outputSummary?: string;
    }>;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    timestamp?: string;
    duration?: string;
    status?: "active" | "success" | "failure" | "idle" | "skipped";
    category?: string;
    color?: string;
}

export interface AgentNodeData extends BaseNodeData {
    agentType?: string;
}

export interface LLMNodeData extends BaseNodeData {
    model: string;
    provider?: string;
    tokens?: number;
    cost?: number;
    history?: Array<{
        requestStep: number;
        responseStep: number;
        source: string;
        prompt: any;
        response: any;
    }>;
}

export interface PromptNodeData extends BaseNodeData {
    templateName?: string;
}

export interface ToolNodeData extends BaseNodeData {
    toolName: string;
    description: string;
    logo?: string;
}

export type LineageNode = Node<
    AgentNodeData | LLMNodeData | PromptNodeData | ToolNodeData
>;

export interface SequenceEdgeData {
    stepNumber: number;
    payload?: any;
}

export type LineageEdge = Edge<SequenceEdgeData>;
