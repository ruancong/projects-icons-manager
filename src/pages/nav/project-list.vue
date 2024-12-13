<template>
  <div class="project-list">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="进行中" value="1" />
            <el-option label="已完成" value="2" />
            <el-option label="已暂停" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="80" />
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始时间" />
      <el-table-column prop="endDate" label="结束时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-container">
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

    <!-- 在原有代码最后添加弹窗组件 -->
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
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" class="w-full">
            <el-option label="进行中" value="1" />
            <el-option label="已完成" value="2" />
            <el-option label="已暂停" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间区间" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 定义接口
interface SearchFormState {
  name: string;
  status: string;
}

interface ProjectItem {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

// 在接口定义区域添加 FormData 接口
interface FormData {
  name: string;
  status: string;
  dateRange: [Date, Date] | undefined;
}

// 搜索表单数据
const searchForm = reactive<SearchFormState>({
  name: '',
  status: '',
});

// 表格数据
const loading = ref<boolean>(false);
const tableData = ref<ProjectItem[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

// 获取表格数据
const fetchData = async () => {
  loading.value = true;
  try {
    // 这里替换为实际的API调用
    // const res = await api.getProjectList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...searchForm
    // })

    // 模拟数据
    const mockData: ProjectItem[] = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `项目${index + 1}`,
      status: ['1', '2', '3'][Math.floor(Math.random() * 3)],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
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

// 状态映射
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    '1': '进行中',
    '2': '已完成',
    '3': '已暂停',
  };
  return statusMap[status] || '未知状态';
};

const getStatusType = (status: string): 'primary' | 'success' | 'warning' | 'info' => {
  const typeMap: Record<string, 'primary' | 'success' | 'warning'> = {
    '1': 'primary',
    '2': 'success',
    '3': 'warning',
  };
  return typeMap[status] || 'info';
};

// 搜索处理
const handleSearch = (): void => {
  currentPage.value = 1;
  fetchData();
};

// 重置搜索
const resetSearch = (): void => {
  searchForm.name = '';
  searchForm.status = '';
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
  formData.status = '';
  formData.dateRange = undefined;
  // 重置表单验证
  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// 编辑项目
const handleEdit = (row: ProjectItem): void => {
  ElMessage.info(`点击了编辑按钮，项目ID：${row.id}`);
};

// 删除项目
const handleDelete = (row: ProjectItem): void => {
  ElMessageBox.confirm(`确认删除项目"${row.name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('删除成功');
      fetchData();
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
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
  status: '',
  dateRange: undefined,
});

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择项目状态', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择时间区间', trigger: 'change' }],
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
        status: formData.status,
        startDate: formData.dateRange?.[0],
        endDate: formData.dateRange?.[1],
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
.project-list {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.table-toolbar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
