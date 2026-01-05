import { LineageNode, LineageEdge } from "@/types/lineage";

// Helper to generate distinct IDs
const generateId = (prefix: string, baseId: string) => `${prefix}-${baseId}`;

export function transformGraph(rawGraph: any): {
    nodes: LineageNode[];
    edges: LineageEdge[];
} {
    // --- Hardcoded Flight Booking Workflow ---
    // User -> Planner -> Search -> Booking -> Email -> End

    // 1. Nodes

    // Groups (Infrastructure Layer)
    const groups: LineageNode[] = [
        {
            id: "group-agent_tool",
            type: "group",
            position: { x: 350, y: 100 },
            style: {
                width: 900,
                height: 250,
                zIndex: -1,
                border: "none",
                backgroundColor: "transparent",
            },
            data: { label: "Agents", color: "#3b82f6" },
            draggable: false,
            selected: false,
        },
        {
            id: "group-node_tool",
            type: "group",
            position: { x: 350, y: 450 },
            style: {
                width: 900,
                height: 200,
                zIndex: -1,
                border: "none",
                backgroundColor: "transparent",
            },
            data: { label: "Tools", color: "#64748b" },
            draggable: false,
            selected: false,
        },
        {
            id: "group-llm_tool",
            type: "group",
            position: { x: 350, y: 750 },
            style: {
                width: 900,
                height: 200,
                zIndex: -1,
                border: "none",
                backgroundColor: "transparent",
            },
            data: { label: "Intelligence Sources", color: "#0e7490" },
            draggable: false,
            selected: false,
        },
    ];

    const nodes: LineageNode[] = [
        // --- Start Node (User) ---
        {
            id: "start-1",
            type: "start",
            position: { x: 50, y: 180 },
            data: {
                label: "User Request",
                status: "success",
                description:
                    "Initiates the workflow with the user's initial travel query.",
            },
        },

        // --- Agents (Row 1, Y=180) --

        // Planner Agent
        {
            id: "agent-planner",
            type: "agent",
            parentId: "group-agent_tool",
            extent: "parent",
            position: { x: 50, y: 80 },
            data: {
                label: "Planner Agent",
                agentType: "Worker",
                status: "success",
                description:
                    "Analyzes user requests to determine travel intent and orchestrates the necessary tools for flight discovery.",
                inputs: {
                    source: "User Chat",
                    content: "Book flight to NYC next Friday...",
                    context: { userId: "u_77812", premium: true },
                },
                outputs: {
                    action: "Search Flights",
                    reasoning:
                        "User requested flight to NYC for specific date. Prioritizing Delta due to user history.",
                    params: {
                        originLocationCode: "SFO",
                        destinationLocationCode: "JFK",
                        departureDate: "2026-01-12",
                        carriers: ["DL"],
                        maxPrice: 400,
                    },
                },
                category: "agent_tool",
                duration: "1.2s",
            },
        },

        // Booking Agent
        {
            id: "agent-booking",
            type: "agent",
            parentId: "group-agent_tool",
            extent: "parent",
            position: { x: 550, y: 80 },
            data: {
                label: "Booking Agent",
                agentType: "Worker",
                status: "success",
                description:
                    "Finalizes the reservation by selecting the best flight, generating a PNR, and initiating the confirmation process.",
                inputs: {
                    searchResults: [
                        {
                            id: "offer_1",
                            airline: "DL",
                            price: "350.50",
                            segments: [
                                { dept: "SFO", arr: "JFK", time: "08:00" },
                            ],
                        },
                        {
                            id: "offer_2",
                            airline: "UA",
                            price: "410.00",
                            segments: [
                                { dept: "SFO", arr: "EWR", time: "09:00" },
                            ],
                        },
                    ],
                    policy: { max_price: 400, preferred_carrier: "DL" },
                },
                outputs: {
                    bookingId: "CONF-9921",
                    pnr: "H7KL2M",
                    flightId: "DL114",
                    status: "Confirmed",
                    totalCharged: { amount: 350.5, currency: "USD" },
                    ticketUrl: "https://fly.delta.com/t/H7KL2M",
                },
                category: "agent_tool",
                duration: "1.5s",
            },
        },

        // --- Tools (Row 2, Y=500) ---

        // Search Tool (Below Planner)
        {
            id: "tool-search",
            type: "tool",
            parentId: "group-node_tool",
            extent: "parent",
            position: { x: 50, y: 50 },
            data: {
                label: "Flight Search Tool",
                toolName: "amadeus_flight_search",
                description:
                    "Connects to global distribution systems (GDS) via Amadeus API to retrieve real-time flight availability and pricing.",
                inputs: {
                    origin: "SFO",
                    destination: "JFK",
                    date: "2026-01-12",
                    adults: 1,
                    currencyCode: "USD",
                },
                outputs: {
                    meta: {
                        count: 2,
                        links: {
                            self: "https://test.api.amadeus.com/v2/shopping/flight-offers",
                        },
                    },
                    data: [
                        {
                            type: "flight-offer",
                            id: "offer_1",
                            source: "GDS",
                            itineraries: [
                                {
                                    duration: "PT5H30M",
                                    segments: [
                                        {
                                            departure: {
                                                iataCode: "SFO",
                                                at: "2026-01-12T08:00:00",
                                            },
                                            arrival: {
                                                iataCode: "JFK",
                                                terminal: "4",
                                                at: "2026-01-12T16:30:00",
                                            },
                                            carrierCode: "DL",
                                            number: "114",
                                            aircraft: { code: "321" },
                                        },
                                    ],
                                },
                            ],
                            price: {
                                currency: "USD",
                                total: "350.50",
                                base: "300.00",
                            },
                        },
                        {
                            type: "flight-offer",
                            id: "offer_2",
                            source: "GDS",
                            itineraries: [
                                {
                                    duration: "PT6H00M",
                                    segments: [
                                        {
                                            departure: {
                                                iataCode: "SFO",
                                                at: "2026-01-12T09:00:00",
                                            },
                                            arrival: {
                                                iataCode: "EWR",
                                                terminal: "C",
                                                at: "2026-01-12T17:00:00",
                                            },
                                            carrierCode: "UA",
                                            number: "442",
                                            aircraft: { code: "738" },
                                        },
                                    ],
                                },
                            ],
                            price: {
                                currency: "USD",
                                total: "410.00",
                                base: "350.00",
                            },
                        },
                    ],
                },
                category: "node_tool",
            },
        },

        // Email Tool (Below Booking)
        {
            id: "tool-email",
            type: "tool",
            parentId: "group-node_tool",
            extent: "parent",
            position: { x: 550, y: 50 },
            data: {
                label: "Email Tool",
                toolName: "SendGridV3",
                description:
                    "Sends transactional emails to users for confirmations, updates, or notifications.",
                inputs: {
                    personalizations: [{ to: [{ email: "user@example.com" }] }],
                    from: {
                        email: "bookings@travel-bot.com",
                        name: "Travel Bot",
                    },
                    subject:
                        "Start Packing! Your flight DL114 to JFK is confirmed.",
                    content: [
                        {
                            type: "text/html",
                            value: "<h1>Booking Confirmed</h1><p>PNR: H7KL2M</p>...",
                        },
                    ],
                },
                outputs: {
                    statusCode: 202,
                    headers: {
                        "x-message-id": "Za8_9Bp_S-K92",
                        server: "nginx",
                    },
                    body: "",
                },
                category: "node_tool",
            },
        },

        // --- LLM (Row 3, Y=800) ---
        {
            id: "llm-shared",
            type: "llm",
            parentId: "group-llm_tool",
            extent: "parent",
            position: { x: 300, y: 50 },
            data: {
                model: "gpt-4-turbo-preview",
                provider: "OpenAI",
                label: "Shared Brain",
                description:
                    "A centralized Large Language Model (GPT-4) that provides reasoning and decision-making capabilities to all agents in the workflow.",
                status: "success",
                category: "llm_tool",
                history: [
                    {
                        requestStep: 1,
                        responseStep: 2,
                        source: "Planner Agent",
                        prompt: {
                            model: "gpt-4-turbo-preview",
                            messages: [
                                {
                                    role: "system",
                                    content:
                                        "You are a travel planner. Extract constraints.",
                                },
                                {
                                    role: "user",
                                    content:
                                        "Book flight to NYC next Friday for < $400, prefer Delta.",
                                },
                            ],
                        },
                        response: {
                            id: "chatcmpl-8x92...",
                            object: "chat.completion",
                            created: 1709428202,
                            model: "gpt-4-turbo-preview",
                            choices: [
                                {
                                    index: 0,
                                    message: {
                                        role: "assistant",
                                        content:
                                            '{\n  "intent": "book_flight",\n  "destination": "NYC",\n  "date": "2026-01-12",\n  "budget": 400,\n  "airline_pref": "Delta"\n}',
                                    },
                                    finish_reason: "stop",
                                },
                            ],
                            usage: {
                                prompt_tokens: 45,
                                completion_tokens: 38,
                                total_tokens: 83,
                            },
                        },
                    },
                    {
                        requestStep: 3,
                        responseStep: 4,
                        source: "Booking Agent",
                        prompt: {
                            model: "gpt-4-turbo-preview",
                            messages: [
                                {
                                    role: "system",
                                    content:
                                        "Select the best flight offer based on constraints.",
                                },
                                {
                                    role: "user",
                                    content:
                                        "Constraints: <$400, Delta.\nOffers: [ {id: 'offer_1', price: 350.50, airline: 'DL'}, {id: 'offer_2', price: 410.00, airline: 'UA'} ]",
                                },
                            ],
                        },
                        response: {
                            id: "chatcmpl-8x93...",
                            object: "chat.completion",
                            choices: [
                                {
                                    index: 0,
                                    message: {
                                        role: "assistant",
                                        content:
                                            '{\n  "selected_offer_id": "offer_1",\n  "reasoning": "Offer 1 is Delta (DL) and $350.50, which is under the $400 limit. Offer 2 is over budget."\n}',
                                    },
                                    finish_reason: "stop",
                                },
                            ],
                            usage: {
                                prompt_tokens: 120,
                                completion_tokens: 45,
                                total_tokens: 165,
                            },
                        },
                    },
                ],
            },
        },

        // --- End Node ---
        {
            id: "end-1",
            type: "end",
            position: { x: 1300, y: 180 },
            data: {
                label: "Workflow Complete",
                status: "success",
                description:
                    "Indicates the successful completion of the flight booking workflow.",
            },
        },
    ];

    const finalNodes = [...groups, ...nodes];

    // 2. Edges
    const edges: LineageEdge[] = [
        // Start -> Planner
        {
            id: "e-start-planner",
            source: "start-1",
            target: "agent-planner",
            sourceHandle: "right",
            targetHandle: "left",
            type: "sequence",
            animated: true,
            style: { stroke: "#94a3b8" },
            data: {
                stepNumber: 1,
                payload: {
                    from: "User",
                    to: "Planner",
                    data: {
                        message:
                            "I need to fly to NYC for a conference next Friday (Jan 12th). Please book the Delta flight if it's under $400.",
                    },
                },
            },
        },

        // --- Planner Agent Interactions ---

        // Planner -> LLM (Request)
        {
            id: "e-planner-llm",
            source: "agent-planner",
            target: "llm-shared",
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "sequence",
            animated: true,
            style: { stroke: "#0e7490" },
            data: {
                stepNumber: 2,
                payload: {
                    request: {
                        messages: [
                            {
                                role: "system",
                                content: "You are a travel planner...",
                            },
                            { role: "user", content: "Book flight to NYC..." },
                        ],
                    },
                },
            },
        },
        // LLM -> Planner (Response)
        {
            id: "e-llm-planner",
            source: "llm-shared",
            target: "agent-planner",
            sourceHandle: "top-out",
            targetHandle: "bottom",
            type: "sequence",
            animated: true,
            style: { stroke: "#0e7490" },
            data: {
                stepNumber: 3,
                payload: {
                    response: {
                        content:
                            '{ "intent": "book_flight", "destination": "NYC", ... }',
                        usage: { total_tokens: 83 },
                    },
                },
            },
        },

        // Planner -> Search Tool (Request)
        {
            id: "e-planner-search",
            source: "agent-planner",
            target: "tool-search",
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "sequence",
            animated: true,
            style: { stroke: "#3b82f6" },
            data: {
                stepNumber: 4,
                payload: {
                    api: "GET /v2/shopping/flight-offers",
                    params: { origin: "SFO", dest: "JFK", date: "2026-01-12" },
                },
            },
        },
        // Search Tool -> Planner (Response)
        {
            id: "e-search-planner",
            source: "tool-search",
            target: "agent-planner",
            sourceHandle: "top-out",
            targetHandle: "bottom",
            type: "sequence",
            animated: true,
            style: { stroke: "#3b82f6" },
            data: {
                stepNumber: 5,
                payload: {
                    status: 200,
                    body: {
                        data: [
                            {
                                id: "offer_1",
                                price: { total: "350.50" },
                                carrier: "DL",
                            },
                            {
                                id: "offer_2",
                                price: { total: "410.00" },
                                carrier: "UA",
                            },
                        ],
                    },
                },
            },
        },

        // Planner -> Booking (Handoff)
        {
            id: "e-planner-booking",
            source: "agent-planner",
            target: "agent-booking",
            sourceHandle: "right",
            targetHandle: "left",
            type: "sequence",
            animated: true,
            style: { stroke: "#94a3b8" },
            data: {
                stepNumber: 6,
                payload: {
                    from: "Planner",
                    to: "Booking",
                    data: {
                        task: "finalize_booking",
                        candidateOffers: ["offer_1", "offer_2"],
                        constraints: { max_price: 400, airline: "DL" },
                    },
                },
            },
        },

        // --- Booking Agent Interactions ---

        // Booking -> LLM (Request)
        {
            id: "e-booking-llm",
            source: "agent-booking",
            target: "llm-shared",
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "sequence",
            animated: true,
            style: { stroke: "#0e7490" },
            data: {
                stepNumber: 7,
                payload: {
                    request: {
                        messages: [
                            { role: "system", content: "Select best offer..." },
                            { role: "user", content: "Constraints: <$400..." },
                        ],
                    },
                },
            },
        },
        // LLM -> Booking (Response)
        {
            id: "e-llm-booking",
            source: "llm-shared",
            target: "agent-booking",
            sourceHandle: "top-out",
            targetHandle: "bottom",
            type: "sequence",
            animated: true,
            style: { stroke: "#0e7490" },
            data: {
                stepNumber: 8,
                payload: {
                    response: {
                        content:
                            '{ "selected_offer_id": "offer_1", "reasoning": "..." }',
                        usage: { total_tokens: 165 },
                    },
                },
            },
        },

        // Booking -> Email Tool (Request)
        {
            id: "e-booking-email",
            source: "agent-booking",
            target: "tool-email",
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "sequence",
            animated: true,
            style: { stroke: "#3b82f6" },
            data: {
                stepNumber: 9,
                payload: {
                    api: "POST /v3/mail/send",
                    body: {
                        to: "user@example.com",
                        subject: "Confirmed: DL114",
                    },
                },
            },
        },
        // Email Tool -> Booking (Response)
        {
            id: "e-email-booking",
            source: "tool-email",
            target: "agent-booking",
            sourceHandle: "top-out",
            targetHandle: "bottom",
            type: "sequence",
            animated: true,
            style: { stroke: "#3b82f6" },
            data: {
                stepNumber: 10,
                payload: {
                    status: 202,
                    message: "Accepted",
                },
            },
        },

        // Booking -> End
        {
            id: "e-booking-end",
            source: "agent-booking",
            target: "end-1",
            sourceHandle: "right",
            targetHandle: "left",
            type: "sequence",
            animated: true,
            style: { stroke: "#94a3b8" },
            data: {
                stepNumber: 11,
                payload: {
                    status: "Success",
                    result: {
                        bookingReference: "H7KL2M",
                        ticketNumber: "0062349112",
                        flight: "DL114",
                        total: "350.50 USD",
                    },
                },
            },
        },
    ];

    return { nodes: finalNodes, edges };
}
