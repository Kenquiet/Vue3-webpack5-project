import type { GlobEnvConfig } from '../config/config';

const NODE_ENV = process.env.NODE_ENV
const ENV = process.env

export function getGlobEnvConfig(): GlobEnvConfig {
  const env = NODE_ENV;
  return (env as unknown) as GlobEnvConfig;
}

/**
 * @description: 开发模式
 */
export const devMode = 'development';

/**
 * @description: 生产模式
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
export function getEnv(): string | undefined {
  return process.env.MODE;
}

/**
 * @description: 是否是开发模式
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return NODE_ENV === devMode;
}

/**
 * @description: 是否是生产模式模式
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return NODE_ENV === prodMode;
}

/**
 * @description: 是否开启mock
 * @returns:
 * @example:
 */
export function isUseMock(): boolean {
  return ENV.VITE_USE_MOCK === 'true';
}