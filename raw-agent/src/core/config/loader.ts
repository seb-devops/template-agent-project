import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { parseRawAgentConfig, type RawAgentConfig } from './config';

const ENV_VAR_PATTERN = /\$\{([A-Z0-9_]+)\}/g;
const DEFAULT_CONFIG_PATH = 'config/raw-agent.yaml';

// Use Record to model dynamic key-value env maps.
export type EnvMap = Readonly<Record<string, string | undefined>>;

export async function loadRawAgentConfig(
  configPath = DEFAULT_CONFIG_PATH,
  env: EnvMap = process.env,
): Promise<RawAgentConfig> {
  const absoluteConfigPath = resolve(process.cwd(), configPath);
  const configFileContent = await readFile(absoluteConfigPath, 'utf-8');
  const rawConfig = parse(configFileContent) as unknown;
  const resolvedConfig = resolveEnvPlaceholders(rawConfig, env);

  return parseRawAgentConfig(resolvedConfig);
}

function resolveEnvPlaceholders(value: unknown, env: EnvMap): unknown {
  if (typeof value === 'string') {
    return value.replace(ENV_VAR_PATTERN, (_, name: string) => {
      const envValue = env[name];

      if (!envValue) {
        throw new Error(`Missing environment variable "${name}" in raw-agent config resolution.`);
      }

      return envValue;
    });
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveEnvPlaceholders(item, env));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveEnvPlaceholders(item, env)]),
    );
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
