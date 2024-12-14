<template>
  <div>项目详情{{ projectId }}</div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute<'/project/[id]'>();
const projectId = route.params.id;
</script>
