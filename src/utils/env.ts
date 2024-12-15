type ModeEnum = 'mock' | 'development' | 'production';

interface EnvConfig {
  BASE_URL: string;
  BASE_API_URL: string;
  USE_MOCK: boolean;
  MODE: ModeEnum;
}

export default function getEnv(): EnvConfig {
  return {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
    USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
    MODE: import.meta.env.MODE as ModeEnum,
  };
}


