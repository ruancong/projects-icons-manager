// import "~/styles/element/index.scss";

import ElementPlus from 'element-plus';
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import { routes } from 'vue-router/auto-routes';
import App from './App.vue';

import '~/styles/index.scss';

import 'uno.css';
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss';
import 'element-plus/theme-chalk/src/message-box.scss';

// if you do not need ssg:
import { createApp } from 'vue';
import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';


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
app.mount('#app');
