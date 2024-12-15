<template>
  <div class="p-5">
    <!-- 顶部操作栏 -->
    <div class="mb-5 p-4 bg-white rounded shadow-sm">
      <el-button-group>
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑项目
        </el-button>
        <el-button type="danger" @click="showDeleteConfirm">
          <el-icon><Delete /></el-icon>
          删除项目
        </el-button>
        <!-- 其他操作按钮 -->
        <el-button @click="handleMore">
          <el-icon><More /></el-icon>
          更多操作
        </el-button>
      </el-button-group>
    </div>

    <!-- 项目详情内容区 -->
    <div class="p-6 bg-white rounded shadow-sm">
      <h1>项目详情 - {{ projectId }}</h1>
      <!-- 项目详情内容 -->
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%">
      <span>确定要删除该项目吗？此操作不可恢复。</span>
      <template #footer>
        <span class="flex justify-end gap-3">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDelete">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Delete, Edit, More } from '@element-plus/icons-vue';

const route = useRoute<'/project/[id]'>();
const router = useRouter();
const projectId = route.params.id;
const deleteDialogVisible = ref(false);

// 编辑项目
const handleEdit = () => {
  router.push(`/project/${projectId}/edit`);
};

// 显示删除确认框
const showDeleteConfirm = () => {
  deleteDialogVisible.value = true;
};

// 删除项目
const handleDelete = async () => {};

// 更多操作
const handleMore = () => {
  // 实现更多操作的逻辑
};
</script>
