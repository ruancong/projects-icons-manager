import getEnv from '~/utils/env';
import { setupMSW } from './browser';

// 根据环境变量决定是否启用 mock
const { USE_MOCK } = getEnv();
export async function setupMocks() {
  if (USE_MOCK) {
    return setupMSW();
  }
  return Promise.resolve();
}
