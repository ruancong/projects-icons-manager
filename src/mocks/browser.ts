import { setupWorker } from 'msw/browser'
import { handlers } from '../api/mock-handlers'

// 获取当前的 base URL
const baseUrl = import.meta.env.BASE_URL;

export const worker = setupWorker(...handlers)

// 导出一个初始化函数
export async function setupMSW() {
  // 在生产环境中使用完整的路径
  const workerUrl = `${baseUrl}mockServiceWorker.js`;
  
  return worker.start({
    serviceWorker: {
      url: workerUrl,
    },
    onUnhandledRequest: 'bypass',
  });
} 