<script lang="ts" setup>
import { repository } from '~/../package.json';
import { FolderOpened } from '@element-plus/icons-vue';
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
    <el-menu-item index="/">
      <div class="flex items-center justify-center gap-2">
        <el-icon color="var(--ep-color-primary)" size="30"><FolderOpened /></el-icon>
        <span>项目静态资源管理</span>
      </div>
    </el-menu-item>

    <el-menu-item h="full">
      <a class="flex size-full items-center justify-center" :href="repository.url" target="_blank">
        <div w-8 h-8 i-ri-github-fill />
      </a>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss">
.el-menu-demo {
  &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
    margin-right: auto;
  }
}
</style>
