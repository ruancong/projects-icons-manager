import { ref } from 'vue';

const isShowGlobalLoading = ref(false);

/**
 * 全局loading
 */
export function useGlobalLoading() {
  return { isShowGlobalLoading };
}
