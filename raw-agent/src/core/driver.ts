import { OpenAI } from 'openai';
import { createRawAgentConfigFromFile } from '@/core/config';

type OpenAIConstructorOptions = NonNullable<ConstructorParameters<typeof OpenAI>[0]>;
// Use Pick so the API key requirement is derived from OpenAI's real constructor type.
type OpenAIMinimumConfig = Required<Pick<OpenAIConstructorOptions, 'apiKey'>>;
// Use Omit to reuse all other constructor options without redefining them.
type OpenAIOptionalConfig = Partial<Omit<OpenAIConstructorOptions, 'apiKey'>>;
// Use Readonly to keep startup config immutable after driver construction.
export type DriverConfig = Readonly<{
  openai?: OpenAIMinimumConfig & OpenAIOptionalConfig;
}>;

type DriverClients = Readonly<{
  openai: OpenAI;
}>;

export class Driver {
  private readonly clients: DriverClients;

  constructor(config: DriverConfig = {}) {
    this.clients = {
      openai: this.createOpenAIClient(config.openai),
    };
  }

  static async fromConfigFile(configPath?: string): Promise<Driver> {
    const config = await createRawAgentConfigFromFile(configPath);

    return new Driver({
      openai: config.openai,
    });
  }

  get openai(): OpenAI {
    return this.clients.openai;
  }

  getClients(): DriverClients {
    return this.clients;
  }

  private createOpenAIClient(config?: DriverConfig['openai']): OpenAI {
    const apiKey = this.resolveOpenAIApiKey(config?.apiKey);

    return new OpenAI({
      ...config,
      apiKey,
    });
  }

  private resolveOpenAIApiKey(
    apiKeyFromConfig?: OpenAIConstructorOptions['apiKey'],
  ): OpenAIConstructorOptions['apiKey'] {
    if (apiKeyFromConfig) {
      return apiKeyFromConfig;
    }

    // Use NonNullable to document that runtime validation guarantees a concrete string.
    const apiKeyFromEnv = process.env.OPENAI_API_KEY as NonNullable<string | undefined>;

    if (!apiKeyFromEnv) {
      throw new Error(
        'Missing OpenAI API key. Set OPENAI_API_KEY or pass openai.apiKey to Driver config.',
      );
    }

    return apiKeyFromEnv;
  }
}

export function createDriver(config: DriverConfig = {}): Driver {
  return new Driver(config);
}

// Use Awaited to keep async factory return type in sync with Driver.fromConfigFile.
type DriverFromConfigFile = Awaited<ReturnType<typeof Driver.fromConfigFile>>;

export async function createDriverFromConfigFile(configPath?: string): Promise<DriverFromConfigFile> {
  return Driver.fromConfigFile(configPath);
}