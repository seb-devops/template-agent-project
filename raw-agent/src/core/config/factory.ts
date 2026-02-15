import { loadRawAgentConfig, type EnvMap } from './loader';
import { parseRawAgentConfig, type RawAgentConfig } from './config';

// Use Parameters so factory input always follows parser input type.
type CreateRawAgentConfigInput = Parameters<typeof parseRawAgentConfig>[0];

export function createRawAgentConfig(input: CreateRawAgentConfigInput): RawAgentConfig {
  return parseRawAgentConfig(input);
}

export async function createRawAgentConfigFromFile(
  configPath?: string,
  env?: EnvMap,
): Promise<RawAgentConfig> {
  return loadRawAgentConfig(configPath, env);
}
