// File: src/config/env.ts

interface EnvConfig {
  isProd: boolean;
  isDev: boolean;
  isTest: boolean;
  mode: string;
  baseUrl: string;
  apiUrl: string;
}

export const config: EnvConfig = {
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  isTest: import.meta.env.MODE === 'test',
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.VITE_BASE_URL || '/',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
};