<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，页面不存在</p>
    <el-button @click="goHome">返回首页</el-button>
    <el-button @click="goBack">返回上一页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
}
</style> 