import { createMiddleware } from 'hono/factory';
import { createDriverFromConfigFile, type Driver } from '@/core/driver';

declare module 'hono' {
  interface ContextVariableMap {
    driver: Driver;
  }
}

type DriverContextMiddlewareOptions = Readonly<{
  driver?: Driver;
  configPath?: string;
}>;

export function createDriverContextMiddleware(options: DriverContextMiddlewareOptions = {}) {
  // Initialize once and reuse for all requests so every route gets the same driver instance.
  const driverPromise = options.driver
    ? Promise.resolve(options.driver)
    : createDriverFromConfigFile(options.configPath);

  return createMiddleware(async (c, next) => {
    const driver = await driverPromise;
    c.set('driver', driver);
    await next();
  });
}

type DriverContextReader = Readonly<{
  get: (key: 'driver') => Driver;
}>;

export function getDriver(context: DriverContextReader): Driver {
  return context.get('driver');
}
