import { Node, Edge } from "reactflow";

export type LineageNodeType =
    | "start"
    | "end"
    | "agent"
    | "llm"
    | "prompt"
    | "tool";

export interface BaseNodeData {
    label: string;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    timestamp?: string;
    duration?: string;
    status?: "active" | "success" | "failure" | "idle";
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
}

export type LineageEdge = Edge<SequenceEdgeData>;
