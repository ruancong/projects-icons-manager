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
      <h1 class="mb-4">项目详情 - {{ projectId }}</h1>

      <!-- Icon列表表格 -->
      <el-table :data="iconList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="Icon名称" />
        <el-table-column prop="ossPath" label="OSS路径" show-overflow-tooltip />
        <el-table-column prop="version" label="当前版本号" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button-group>
              <el-button size="small" @click="handlePreview(scope.row)">
                <el-icon><View /></el-icon>
              </el-button>
              <el-button size="small" type="primary" @click="handleIconEdit(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="handleIconDelete(scope.row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Delete, Edit, More, View } from '@element-plus/icons-vue';
import api from '~/api/api';
import type { IconVO } from '~/types/api-vo-types';

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

const iconList = ref<IconVO[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取图标列表
const getIconList = async () => {
  const response = await api.queryProjectIcons(projectId, currentPage.value, pageSize.value);
  iconList.value = response.list;
  total.value = response.total;
};

// 分页处理函数
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getIconList();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getIconList();
};

// 图标操作函数
const handlePreview = (row: IconVO) => {
  // 实现预览逻辑
  console.log('预览图标:', row);
};

const handleIconEdit = (row: IconVO) => {
  // 实现编辑逻辑
  console.log('编辑图标:', row);
};

const handleIconDelete = (row: IconVO) => {
  // 实现删除逻辑
  console.log('删除图标:', row);
};

// 页面加载时获取数据
onMounted(() => {
  getIconList();
});
</script>
