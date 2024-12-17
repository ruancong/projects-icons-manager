<template>
  <div flex items-center justify-center mt-10>
    <div class="h-8 w-8 animate-bounce text-$ep-color-primary" i-ri-arrow-down-circle-fill />
    <h1 class="color-$ep-color-primary">项目静态资源管理系统</h1>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { FolderOpened } from '@element-plus/icons-vue';

const router = useRouter();
//router.replace('/nav/project-list');
</script>
