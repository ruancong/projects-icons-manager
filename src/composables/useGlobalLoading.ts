import { ElLoading } from 'element-plus';
import { ref, watch } from 'vue';

const isShowGlobalLoading = ref(false);
let loadingInstance: ReturnType<typeof ElLoading.service>;

watch(isShowGlobalLoading, (newVal) => {
  if (newVal) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  } else {
    loadingInstance?.close();
  }
});

/**
 * 全局loading
 */
export function useGlobalLoading() {
  return { isShowGlobalLoading };
}
