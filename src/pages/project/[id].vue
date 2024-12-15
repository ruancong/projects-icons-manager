<template>
  <div class="project-detail">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
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
    <div class="content">
      <h1>项目详情 - {{ projectId }}</h1>
      <!-- 项目详情内容 -->
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%">
      <span>确定要删除该项目吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
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

<style scoped>
.project-detail {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
