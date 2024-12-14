import axios, { AxiosRequestConfig } from 'axios';
import { useGlobalLoading } from '~/composables/useGlobalLoading';
import { MyError } from '~/types/app-types';
import { useGlobalMessage } from '~/composables/useGlobalMessage';
import getEnv from './env';

const { isShowGlobalLoading } = useGlobalLoading();

// 不显示错误提示的码
const NOT_SHOW_ERROR_CODES: string[] = [];
const { BASE_URL } = getEnv();

const service = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 8000,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    config.baseURL = BASE_URL;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      if (response.data.code !== '0') {
        if (!notShowErrorMsg(response.data.code)) {
          const { error } = useGlobalMessage();
          error(response.data.message || '发生了点异常！');
        }
        throw new MyError(response.data.code, response.data.message);
      }
      return response.data;
    } else {
      const { error } = useGlobalMessage();

      error(response.data?.message || '服务器发生了点小意外!');
      return Promise.reject(response);
    }
  },
  function (error) {
    const { error: errorMsg } = useGlobalMessage();
    if (error.message.includes('timeout of')) {
      errorMsg('网络不给力，请检查网络再试一下');
    } else {
      errorMsg('服务器发生了点小意外！');
    }
    return Promise.reject(error);
  },
);

// 处理URL参数
function processUrl(
  url: string,
  pathParams?: Record<string, string>,
  queryParams?: Record<string, unknown>,
): string {
  // 处理路径参数
  let finalUrl = url;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      finalUrl = finalUrl.replace(`{${key}}`, String(value));
    });
  }

  // 处理查询参数
  if (queryParams) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    finalUrl = queryString ? `${finalUrl}?${queryString}` : finalUrl;
  }

  return finalUrl;
}

export default {
  get<T>(
    url: string,
    queryParams?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const finalUrl = processUrl(url, undefined, queryParams);
    return service.get<T, T>(finalUrl, config);
  },

  getWithPathParams<T = unknown>(
    url: string,
    pathParams?: Record<string, string>,
    queryParams?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const finalUrl = processUrl(url, pathParams, queryParams);
    return service.get<T, T>(finalUrl, config);
  },

  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    if (config?.isShowLoading) {
      isShowGlobalLoading.value = true;
    }
    return new Promise((resolve, reject) => {
      service
        .post<T, T, D>(url, data, config)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          isShowGlobalLoading.value = false;
        });
    });
  },

  postWithPathParams<T = unknown, D = unknown>(
    url: string,
    pathParams?: Record<string, string>,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    const finalUrl = processUrl(url, pathParams);
    return this.post<T, D>(finalUrl, data, config);
  },
};

/**
 * 不显示错误提示的码
 * @param code
 */
function notShowErrorMsg(code: string) {
  return NOT_SHOW_ERROR_CODES.indexOf(code) !== -1;
}
