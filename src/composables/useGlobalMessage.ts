import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const isShowing = ref(false);

interface GlobalMessageOptions {
  multiple?: boolean;
}

/**
 * 全局消息提示框
 * @param multiple 是否允许同时出现多个提示框
 */
export function useGlobalMessage({ multiple = false }: GlobalMessageOptions = {}) {
  function error(messageContent = '发生了点异常') {
    if (!isShowMsg()) {
      return;
    }
    isShowing.value = true;

    ElMessage({
      message: messageContent,
      type: 'error',
      onClose: () => {
        isShowing.value = false;
      },
    });
  }

  function warning(messageContent: string) {
    if (!isShowMsg()) {
      return;
    }
    isShowing.value = true;

    ElMessage({
      message: messageContent,
      type: 'warning',
      onClose: () => {
        isShowing.value = false;
      },
    });
  }

  function success(messageContent = '操作成功') {
    if (!isShowMsg()) {
      return;
    }
    isShowing.value = true;

    ElMessage({
      message: messageContent,
      type: 'success',
      onClose: () => {
        isShowing.value = false;
      },
    });
  }

  function info(messageContent: string) {
    if (!isShowMsg()) {
      return;
    }
    isShowing.value = true;

    ElMessage({
      message: messageContent,
      type: 'info',
      onClose: () => {
        isShowing.value = false;
      },
    });
  }

  function isShowMsg() {
    // 不允许多个提示框，且正在显示时直接返回
    return !(!multiple && isShowing.value);
  }

  return { error, warning, success, info };
}
