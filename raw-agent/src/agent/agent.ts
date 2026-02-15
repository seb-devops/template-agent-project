import { OpenAI } from 'openai';

type AgentConfig = {
    model: string;
    systemPrompt: string;
    temperature: number | undefined;
    maxTokens: number | undefined;
    topP: number | undefined;
    frequencyPenalty: number | undefined;
    presencePenalty: number | undefined;
    stop: string[] | undefined;
    n: number | undefined;
}


export class Agent {
    //we will pass options to the agent constructor
    private config: AgentConfig;
    private client: OpenAI;
    constructor(private options: AgentOptions) {
        this.config = new AgentConfig(options);

        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
}

