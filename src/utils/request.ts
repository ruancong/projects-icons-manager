import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useGlobalLoading } from '~/composables/useGlobalLoading';
import { MyError } from '~/types/app-types';
import { useGlobalMessage } from '~/composables/useGlobalMessage';
import getEnv from './env';

const { isShowGlobalLoading } = useGlobalLoading();
const { error } = useGlobalMessage();

const service = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 8000,
});

// 不显示错误提示的码
const NOT_SHOW_ERROR_CODES: string[] = [];

const { BASE_URL } = getEnv();

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
    // 对响应数据做点什么
    if (response.status === 200) {
      if (response.data.code !== '0') {
        if (!notShowErrorMsg(response.data.code)) {
          error(response.data.message || '发生了点异常！');
        } else {
          throw new MyError(response.data.code, response.data.message);
        }
        return response;
      }
      return response.data;
    } else {
      error(response.data.message || '服务器发生了点小意外!！');
    }
    return response;
  },
  function (error) {
    if (error.message.includes('timeout of')) {
      error('网络不给力，请检查网络再试一下');
    } else {
      error('服务器发生了点小意外！');
    }
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      service
        .get<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          const responseData = response.data;
          if (responseData) {
            resolve(responseData);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    if (config?.isShowLoading) {
      isShowGlobalLoading.value = true;
    }
    return new Promise((resolve, reject) => {
      if (config && data) {
        config.data = data;
      }
      service
        .post<T, AxiosResponse<T>, D>(url, data, config)
        .then((response) => {
          const responseData = response.data;
          if (responseData) {
            resolve(responseData);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          isShowGlobalLoading.value = false;
        });
    });
  },
};


/**
 * 不显示错误提示的码
 * @param code
 */
function notShowErrorMsg(code: string) {
  if (NOT_SHOW_ERROR_CODES.indexOf(code) !== -1) {
    return true;
  }
  return false;
}
