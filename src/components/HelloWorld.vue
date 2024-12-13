<script setup lang="ts">
import { ElMessage } from 'element-plus';

defineProps<{ msg: string }>();

function toast() {
  ElMessage.success('Hello');
}
</script>

<template>
  <h1 class="color-$ep-color-primary">
    {{ msg }}
  </h1>

  <!-- example components -->
  <div mb-4>
    <el-button size="large" @click="toast"> El Message </el-button>
  </div>
</template>

<style lang="scss">
.ep-button {
  margin: 4px;
}
.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
