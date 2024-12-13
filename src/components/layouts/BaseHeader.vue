<script lang="ts" setup>
import { repository } from '~/../package.json';

</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
    <el-menu-item index="/">
      <div class="flex items-center justify-center gap-2">
        <div class="h-6 w-6 animate-bounce text-green-500" i-ri-arrow-down-circle-fill />
        <span>Project Icon Management</span>
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
