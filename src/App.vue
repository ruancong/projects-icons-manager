<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="main-container flex">
      <BaseSide />
      <div w-full p-5 bg-gray-100>
        <RouterView />
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useGlobalLoading } from './composables/useGlobalLoading';

useGlobalLoading();
</script>

<style>
#app {
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 4px);
}
</style>
