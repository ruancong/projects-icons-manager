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
import { setupMocks } from './api/mock/init';

const app = createApp(App);
app.use(
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...routes, { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('~/pages/error/404.vue') }],
  }),
);
app.use(ElementPlus, {
  locale: zhCn,
});

// 在应用启动前初始化 mock
setupMocks().then(() => {
  app.mount('#app');
});
