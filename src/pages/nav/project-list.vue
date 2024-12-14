<template>
  <div class="p-5">
    <!-- 搜索区域 -->
    <div class="mb-5 p-5 bg-white rounded">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格工具栏 -->
    <div class="mb-5">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table border v-loading="loading" :data="tableData" class="border w-full">
      <el-table-column prop="id" label="序号" width="100" />
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="rootPath" label="存储根目录" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleToDetail(scope.row)"
            >详情页</el-button
          >
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
interface SearchFormState {
  name: string;
}

interface ProjectItem {
  id: string;
  name: string;
  rootPath: string;
}

// 在接口定义区域添加 FormData 接口
interface FormData {
  name: string;
  rootPath: string;
}

// 搜索表单数据
const searchForm = reactive<SearchFormState>({
  name: '',
});

// 表格数据
const loading = ref<boolean>(false);
const tableData = ref<ProjectItem[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

const router = useRouter();

// 获取表格数据
const fetchData = async () => {
  loading.value = true;
  try {
    // 模拟数据
    const mockData: ProjectItem[] = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1 + '',
      name: `项目${index + 1}`,
      rootPath: `/data/projects/project${index + 1}`,
    }));

    tableData.value = mockData;
    total.value = 100;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = (): void => {
  currentPage.value = 1;
  fetchData();
};

// 重置搜索
const resetSearch = (): void => {
  searchForm.name = '';
  handleSearch();
};

// 分页处理
const handleSizeChange = (val: number): void => {
  pageSize.value = val;
  fetchData();
};

const handleCurrentChange = (val: number): void => {
  currentPage.value = val;
  fetchData();
};

// 新增项目
const handleAdd = (): void => {
  dialogVisible.value = true;
  dialogTitle.value = '新增项目';
  // 重置表单数据
  formData.name = '';
  formData.rootPath = '';
  // 重置表单验证
  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// 详情页
const handleToDetail = (row: ProjectItem): void => {
  router.push(`/project/${row.id}`);
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});

// 在原有的响应式数据后添加
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

// 添加新的处理函数
const handleDialogClose = () => {
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid, fields) => {
    if (valid) {
      // 这里处理表单提交逻辑
      const submitData = {
        name: formData.name,
        rootPath: formData.rootPath,
      };

      console.log('提交的数据：', submitData);
      ElMessage.success('保存成功');
      dialogVisible.value = false;
      // 刷新表格数据
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
