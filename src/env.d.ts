/// <reference types="vite/client" />

import 'axios';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    // 是否显示loading
    isShowLoading?: boolean;
  }
}
