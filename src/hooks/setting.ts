import type { GlobConfig, GlobEnvConfig } from '../config/config';
import { getGlobEnvConfig, isDevMode } from '../utils/env';
import { warn } from '../utils/log';

export const getShortName = (env: any) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
};

const reg = /[a-zA-Z\_]*/;

const ENV_NAME = getShortName(process.env);
const ENV = ((isDevMode() ? getGlobEnvConfig() : window[ENV_NAME as any]) as unknown) as GlobEnvConfig

const {
  VITE_GLOB_APP_TITLE,
  VITE_GLOB_API_URL,
  VITE_GLOB_APP_SHORT_NAME,
  VITE_GLOB_API_URL_PREFIX,
  VITE_GLOB_UPLOAD_URL,
} = ENV;

if (!reg.test(VITE_GLOB_APP_SHORT_NAME)) {
  warn(
    `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
  );
}

export const useGlobSetting = (): Readonly<GlobConfig> => {
  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
  };
  return glob as Readonly<GlobConfig>;
};

