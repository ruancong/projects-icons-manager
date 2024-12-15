<template>
  <div>
    <!-- 顶部操作栏 -->
    <div my-container>
      <div>
        <h3 class="mb-4 mt-0">项目：{{ projectName }}</h3>
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
      </div>
    </div>

    <!-- 项目详情内容区 -->
    <div my-container>
      <h3 class="mb-4 mt-0">项目中icon列表</h3>

      <div mb-2>
        <el-button type="primary" @click="handleAddIcon">新增icon</el-button>
      </div>

      <!-- Icon列表表格 -->
      <el-table border v-loading="tableLoading" :data="iconList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="Icon名称" />
        <el-table-column prop="ossPath" label="OSS路径" show-overflow-tooltip>
          <template #default="scope">
            <div class="flex items-center gap-2">
              <span>{{ scope.row.ossPath }}</span>
              <el-button
                size="small"
                link
                @click="copyToClipboard(scope.row.name, scope.row.ossPath)"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="预览" width="120">
          <template #default="scope">
            <el-image :src="scope.row.ossPath" fit="contain" class="w-10 h-10">
              <template #error>
                <div class="flex items-center justify-center bg-gray-100 flex-col h-full">
                  <el-icon><Picture /></el-icon>
                  <span class="text-xs text-red mt-1">error</span>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="当前版本号" width="120" />
        <el-table-column label="操作">
          <template #default="scope">
            <div>
              <el-button size="small" type="primary" @click="handleIconEdit(scope.row)">
                <span>编辑</span>
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="handleIconDelete(scope.row)">
                <span>删除</span>
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
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

    <!-- 新增 Icon 弹窗表单 -->
    <el-dialog v-model="addIconDialogVisible" title="新增Icon" width="500px">
      <el-form ref="addIconFormRef" :model="addIconForm" :rules="addIconRules" label-width="100px">
        <el-form-item label="Icon名称" prop="name">
          <el-input v-model="addIconForm.name" placeholder="请输入Icon名称" />
        </el-form-item>
        <el-form-item label="Icon文件" prop="file">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :auto-upload="false"
            accept=".svg,.png,.jpg,.jpeg"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">上传图片</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addIconDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleIconSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Delete, Edit, More, CopyDocument, Picture } from '@element-plus/icons-vue';
import api from '~/api/api';
import type { IconVO } from '~/types/api-vo-types';
import { ElMessage } from 'element-plus';
import { useClipboard } from '@vueuse/core';
import type { FormInstance, UploadFile, UploadInstance } from 'element-plus';
import { UploadIconDTO } from '~/types/api-dto-types';

const route = useRoute<'/project/[id]'>();
const router = useRouter();
const projectId = route.params.id;
const projectName = history.state.name;
const deleteDialogVisible = ref(false);
// 使用 useClipboard hook
const { copy } = useClipboard();

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
const tableLoading = ref(false);

// 获取图标列表
const getIconList = async () => {
  tableLoading.value = true;
  const response = await api.queryProjectIcons(projectId, currentPage.value, pageSize.value);
  iconList.value = response.list;
  total.value = response.total;
  tableLoading.value = false;
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

const handleIconEdit = (row: IconVO) => {
  // 实现编辑逻辑
  console.log('编辑图标:', row);
};

const handleIconDelete = (row: IconVO) => {
  // 实现删除逻辑
  console.log('删除图标:', row);
};

// 修改复制函数
const copyToClipboard = async (iconName: string, ossPath: string) => {
  await copy(ossPath);
  ElMessage.success(`${iconName}-复制成功`);
};

// 页面加载时获取数据
onMounted(() => {
  getIconList();
});

// 新增 Icon 相关
const addIconDialogVisible = ref(false);
const addIconFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const submitLoading = ref(false);

const addIconForm = ref({
  name: '',
  file: null as File | null,
});

const addIconRules = {
  name: [
    { required: true, message: '请输入Icon名称', trigger: 'blur' },
    { min: 2, max: 50, message: 'Icon名称长度应在2-50个字符之间', trigger: 'blur' },
  ],
  file: [{ required: true, message: '请上传Icon文件', trigger: 'change' }],
};

// 处理文件选择
const handleFileChange = (file: UploadFile) => {
  addIconForm.value.file = file.raw || null;
};

// 处理文件移除
const handleFileRemove = () => {
  addIconForm.value.file = null;
};

// 打开新增 Icon 弹窗
const handleAddIcon = () => {
  addIconDialogVisible.value = true;
};

// 提交新增 Icon
const handleIconSubmit = async () => {
  if (!addIconFormRef.value) return;

  await addIconFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;

      // todo 上传文件到oss , 获取ossPath
      const formData = new FormData();
      if (addIconForm.value.file) {
        formData.append('file', addIconForm.value.file);
      }

      const uploadIconDTO: UploadIconDTO = {
        name: addIconForm.value.name,
        projectId: projectId,
        ossPath: addIconForm.value.file?.name || '',
      };

      await api.addIcon(uploadIconDTO);
      ElMessage.success('Icon上传成功');
      addIconDialogVisible.value = false;

      // 重置表单
      addIconFormRef.value?.resetFields();
      addIconForm.value.file = null;
      // 清空上传组件的文件列表
      uploadRef.value?.clearFiles();

      // 刷新列表
      await getIconList();

      submitLoading.value = false;
    }
  });
};
</script>
