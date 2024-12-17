<template>
  <div>
    <!-- 搜索区域 -->
    <div class="my-container">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="true" type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格工具栏 -->
    </div>

    <div class="my-container">
      <h3 class="mb-4 mt-0">项目列表</h3>
      <div mb-2>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table border v-loading="loading" :data="tableData" class="border w-full">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="rootPath" label="存储根目录" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleToDetail(scope.row)">
              <span>详情页</span>
              <el-icon><MoreFilled /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="mt-5 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          popper-class="pagination-popper"
          :default-page-size="10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 弹窗组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="存储根目录" prop="rootPath">
          <el-input v-model="formData.rootPath" placeholder="请输入存储根目录" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end gap-3">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { useGlobalMessage } from '~/composables/useGlobalMessage';
import { ProjectVO } from '~/types/api-vo-types';
import api from '~/api/api';
import { MoreFilled } from '@element-plus/icons-vue';

// 1. 接口定义
interface SearchFormState {
  name: string;
}

interface FormData {
  name: string;
  rootPath: string;
}

// 2. 变量声明
const router = useRouter();
const { success } = useGlobalMessage();

// 搜索相关
const searchForm = reactive<SearchFormState>({
  name: '',
});

// 表格相关
const loading = ref<boolean>(false);
const tableData = ref<ProjectVO[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref('新增项目');
const formRef = ref<FormInstance>();
const formData = reactive<FormData>({
  name: '',
  rootPath: '',
});

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  rootPath: [
    { required: true, message: '请输入存储根目录', trigger: 'blur' },
    { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
  ],
};

// 3. 生命周期方法
onMounted(() => {
  fetchData();
});

// 4. 功能方法
// 数据获取
const fetchData = async () => {
  loading.value = true;

  const dataList = await api.queryPageProjects(currentPage.value, pageSize.value);

  tableData.value = dataList.list;
  total.value = dataList.total;

  loading.value = false;
};

// 搜索相关方法
const handleSearch = (): void => {
  currentPage.value = 1;
  fetchData();
};

const resetSearch = (): void => {
  success('重置成功');
  searchForm.name = '';
  handleSearch();
};

// 分页相关方法
const handleSizeChange = (val: number): void => {
  pageSize.value = val;
  fetchData();
};

const handleCurrentChange = (val: number): void => {
  currentPage.value = val;
  fetchData();
};

// 项目操作相关方法
const handleAdd = (): void => {
  dialogVisible.value = true;
  dialogTitle.value = '新增项目';
  formData.name = '';
  formData.rootPath = '';
  nextTick(() => {
    formRef.value?.resetFields();
  });
};

const handleToDetail = (row: ProjectVO): void => {
  router.push({
    path: `/project/${row.id}`,
    state: {
      name: row.name,
    },
  });
};

// 弹窗相关方法
const handleDialogClose = () => {
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      const submitData = {
        name: formData.name,
        rootPath: formData.rootPath,
      };

      await api.createProject(submitData);
      ElMessage.success('保存成功');
      dialogVisible.value = false;
      fetchData();
    } else {
      console.error('表单验证失败:', fields);
    }
  });
};
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
