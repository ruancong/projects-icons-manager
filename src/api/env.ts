type ModeEnum = "mock" | "development" | "production";

interface EnvConfig {
  BASE_URL: string;
  MODE: ModeEnum;
}

export default function getEnv(): EnvConfig {
  return {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    MODE: import.meta.env.MODE as ModeEnum,
  };
}
