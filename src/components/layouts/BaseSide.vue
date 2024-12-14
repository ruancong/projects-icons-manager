<script lang="ts" setup>
import { Menu as IconMenu } from '@element-plus/icons-vue';

// const isCollapse = ref(true)
function handleOpen(key: string, keyPath: string[]) {
  console.log(key, keyPath);
}
function handleClose(key: string, keyPath: string[]) {
  console.log(key, keyPath);
}
</script>

<template>
  <el-menu router default-active="1" class="w-64" @open="handleOpen" @close="handleClose">
    <el-menu-item index="/nav/project-list">
      <el-icon>
        <IconMenu />
      </el-icon>
      <template #title>项目管理</template>
    </el-menu-item>
  </el-menu>
</template>
