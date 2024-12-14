import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { routes } from 'vue-router/auto-routes';
import App from './App.vue';
import '~/styles/index.scss';

import 'uno.css';
import 'element-plus/dist/index.css';

import { createApp } from 'vue';
import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

import getEnv from './utils/env';
import { setupMSW } from './mocks/browser';

const { USE_MOCK } = getEnv();

async function setupMocks() {
  if (USE_MOCK) {
    return setupMSW();
  }
  return Promise.resolve();
}

const app = createApp(App);
app.use(
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  }),
);
app.use(ElementPlus, {
  locale: zhCn,
});

// 在应用启动前初始化 mock
setupMocks().then(() => {
  app.mount('#app');
});
