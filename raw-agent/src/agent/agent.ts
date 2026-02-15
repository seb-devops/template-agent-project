import { OpenAI } from 'openai';
import { Driver } from '@/core';

type AgentConfig = {
    model: string;
    systemPrompt: string;
    tools: Tool[];
}

type Tool = {
    name: string;
    description: string;
    function: () => Promise<string>;
}


export class Agent {
    //we will pass options to the agent constructor
    private config: AgentConfig;
    private client: OpenAI;
    constructor(private options: AgentConfig, private driver: Driver) {
        this.config = options;
        this.client = driver.openai; 
    }

    async generate(prompt: string) {
        const response = await this.client.chat.completions.create({
            model: this.config.model,
            messages: [{ role: 'user', content: prompt }],
        });
    }
}

