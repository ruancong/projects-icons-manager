<template>
  <div flex items-center justify-center>
    <div w-10 h-10 text-xl text-green-500 i-ri-apple-fill />
  </div>
  <HelloWorld msg="Project Icon Manager" />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
router.replace('/nav/project-list'); 
</script>
