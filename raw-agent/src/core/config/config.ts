import { z } from 'zod';

export const rawAgentConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1, 'openai.apiKey is required'),
    baseURL: z.string().url().optional(),
    organization: z.string().min(1).optional(),
    project: z.string().min(1).optional(),
  }),
});

export type RawAgentConfig = z.infer<typeof rawAgentConfigSchema>;

export function parseRawAgentConfig(input: unknown): RawAgentConfig {
  return rawAgentConfigSchema.parse(input);
}
