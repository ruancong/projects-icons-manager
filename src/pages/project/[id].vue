<template>
  <div>
    <!-- 顶部操作栏 -->
    <div my-container>
      <div>
        <h3 class="mb-4 mt-0">项目：{{ projectName }}</h3>
        <el-button :disabled="true" type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑项目
        </el-button>
        <el-button :disabled="true" type="danger" @click="showDeleteConfirm">
          <el-icon><Delete /></el-icon>
          删除项目
        </el-button>
        <!-- 其他操作按钮 -->
        <el-button :disabled="true" @click="handleMore">
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
        <el-table-column prop="name" label="Icon名称" width="120" />
        <el-table-column prop="ossPath" label="OSS路径" min-width="300" show-overflow-tooltip>
          <template #default="{ row }: { row: IconVO }">
            <div class="flex items-center gap-2">
              <el-button size="small" link @click="copyToClipboard(row.name, row.fullOssPath)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
              <span>{{ row.fullOssPath }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="预览" width="120">
          <template #default="{ row }: { row: IconVO }">
            <el-image :src="row.fullOssPath" fit="contain" class="w-10 h-10">
              <template #error>
                <div class="flex items-center justify-center bg-gray-100 flex-col h-full">
                  <el-icon><Picture /></el-icon>
                  <span class="text-xs text-red mt-1">error</span>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="当前版本号" width="120">
          <template #default="{ row }: { row: IconVO }">
            <span>v{{ row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="180">
          <template #default="{ row }: { row: IconVO }">
            <div>
              <el-button size="small" type="primary" @click="handleIconEdit(row)">
                <span>编辑</span>
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" @click="handleShowHistory(row)">
                <span>历史版本</span>
                <el-icon><Timer /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="handleIconDeleteConfirm(row)">
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

    <!-- 新增与编辑 Icon 弹窗表单 -->
    <el-dialog v-model="iconDialogVisible" :title="isEdit ? '编辑icon' : '新增icon'" width="500px">
      <el-form ref="iconFormRef" :model="iconForm" :rules="iconFormRules" label-width="120px">
        <el-form-item label="icon名称" prop="name">
          <el-input v-model="iconForm.name" placeholder="请输入icon名称" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="icon预览:">
          <el-image
            v-if="currentEditIconVO"
            :src="currentEditIconVO.fullOssPath"
            :preview-src-list="[currentEditIconVO.fullOssPath]"
            class="w-10 h-10"
            fit="contain"
          />
        </el-form-item>

        <el-form-item :label="isEdit ? '新icon文件' : 'icon文件'" prop="file">
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
          <el-button @click="iconDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleIconSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 历史版本弹窗 -->
    <el-dialog v-model="historyDialogVisible" title="历史版本" width="500px">
      <el-form label-width="120px">
        <el-form-item label="当前版本:">
          <span>v{{ currentEditIconVO?.version }}</span>
        </el-form-item>

        <el-form-item label="历史版本:">
          <div class="flex gap-2">
            <el-check-tag
              v-for="history in iconHistory"
              :key="history.id"
              :checked="selectedVersion === history.version"
              @change="() => handleVersionChange(history.version)"
              :class="{
                '!text-gray-500 !bg-gray-100 !border-gray-200': selectedVersion !== history.version,
              }"
            >
              v{{ history.version }}
            </el-check-tag>
          </div>
        </el-form-item>

        <el-form-item v-if="selectedHistoryIcon" label="历史版本预览:">
          <el-image
            :src="selectedHistoryIcon.fullOssPath"
            :preview-src-list="[selectedHistoryIcon.fullOssPath]"
            class="w-10 h-10"
            fit="contain"
          />
          <div class="text-xs text-gray-500 mt-1">
            创建时间: {{ new Date(selectedHistoryIcon.createTime).toLocaleString() }}
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="historyDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleRollback"
            :disabled="!selectedVersion || selectedVersion === currentEditIconVO?.version"
          >
            回退到此版本
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除 Icon 确认对话框 -->
    <el-dialog v-model="deleteIconDialogVisible" title="确认删除" width="30%">
      <span>确定要删除icon: {{ currentDeleteIcon?.name }} 吗？此操作不可恢复。</span>
      <template #footer>
        <span class="flex justify-end gap-3">
          <el-button @click="deleteIconDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleIconDelete">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Delete, Edit, More, CopyDocument, Picture, Timer } from '@element-plus/icons-vue';
import api from '~/api/api';
import type { IconVO, IconHistoryVO } from '~/types/api-vo-types';
import { ElMessage } from 'element-plus';
import { useClipboard } from '@vueuse/core';
import type { FormInstance, UploadFile, UploadInstance } from 'element-plus';
import { UploadIconDTO } from '~/types/api-dto-types';

const route = useRoute<'/project/[id]'>();
const router = useRouter();
const projectId = route.params.id as string;
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

const iconDialogVisible = ref(false);
const historyDialogVisible = ref(false);
const isEdit = ref(false);
const currentEditIconVO = ref<IconVO | null>(null);

const iconFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const submitLoading = ref(false);

const iconForm = ref({
  name: '',
  file: null as File | null,
});

const iconFormRules = computed(() => ({
  name: [
    { required: true, message: '请输入Icon名称', trigger: 'blur' },
    { min: 2, max: 50, message: 'Icon名称长度应在2-50个字符之间', trigger: 'blur' },
  ],
  file: [{ required: !isEdit.value, message: '请上传Icon文件', trigger: 'change' }],
}));

// 处理文件选择
const handleFileChange = (file: UploadFile) => {
  iconForm.value.file = file.raw || null;
};

// 处理文件移除
const handleFileRemove = () => {
  iconForm.value.file = null;
};

// 打开新增 Icon 弹窗
const handleAddIcon = () => {
  isEdit.value = false;
  currentEditIconVO.value = null;
  iconForm.value = {
    name: '',
    file: null,
  };
  iconFormRef.value?.clearValidate();
  iconDialogVisible.value = true;
};

// 编辑方法
const handleIconEdit = async (row: IconVO) => {
  isEdit.value = true;
  currentEditIconVO.value = row;
  iconForm.value = {
    name: row.name,
    file: null,
  };

  // 加载历史版本
  try {
    const historyData = await api.queryIconHistory(row.id);
    iconHistory.value = historyData.sort((a, b) => a.version - b.version);
    selectedVersion.value = row.version; // 默认选中当前版本
  } catch (error) {
    console.error('Failed to load icon history:', error);
    ElMessage.error('加载历史版本失败');
  }

  iconFormRef.value?.clearValidate();
  iconDialogVisible.value = true;
};

// 提交方法
const handleIconSubmit = async () => {
  if (!iconFormRef.value) return;

  await iconFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;

      // todo 上传文件到oss , 获取ossPath
      const uploadOssPath = await uploadToOss(iconForm.value.file);

      const uploadIconDTO: UploadIconDTO = {
        name: iconForm.value.name,
        projectId: projectId,
        ossPath: uploadOssPath,
        id: isEdit.value ? currentEditIconVO.value?.id : undefined,
      };

      // 根据是否是编辑模式调用不同的 API
      if (isEdit.value) {
        await api.updateIcon(uploadIconDTO);
        ElMessage.success('Icon更新成功');
      } else {
        await api.addIcon(uploadIconDTO);
        ElMessage.success('Icon上传成功');
      }

      iconDialogVisible.value = false;

      // 重置表单
      iconFormRef.value?.resetFields();
      iconForm.value.file = null;
      uploadRef.value?.clearFiles();

      // 刷新列表
      await getIconList();
      submitLoading.value = false;
    }
  });
};

const deleteIconDialogVisible = ref(false);
const currentDeleteIcon = ref<IconVO | null>(null);

// 显示删除确认框
const handleIconDeleteConfirm = (row: IconVO) => {
  currentDeleteIcon.value = row;
  deleteIconDialogVisible.value = true;
};

// 删除图标
const handleIconDelete = async () => {
  if (!currentDeleteIcon.value) return;
  await api.deleteIcon(currentDeleteIcon.value.id);
  ElMessage.success('删除成功');
  // 刷新列表
  await getIconList();
  deleteIconDialogVisible.value = false;
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

function uploadToOss(file: File | null) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
    // todo 上传文件到oss , 获取ossPath
    // 随机生成一个8位字符串作为文件名
    const ossPath = Math.random().toString(36).substring(2, 15);
    return ossPath;
  }
  return '';
}

// 添加历史版本相关的响应式变量
const iconHistory = ref<IconHistoryVO[]>([]);
const selectedVersion = ref<number>();
const selectedHistoryIcon = computed(() =>
  iconHistory.value.find((h) => h.version === selectedVersion.value),
);

// 处理版本切换
const handleVersionChange = (version: number) => {
  selectedVersion.value = version;
};

// 关闭弹窗时清理历史版本数据
watch(iconDialogVisible, (newVal) => {
  if (!newVal) {
    iconHistory.value = [];
    selectedVersion.value = undefined;
  }
});

// 显示历史版本弹窗
const handleShowHistory = async (row: IconVO) => {
  currentEditIconVO.value = row;

  try {
    const historyData = await api.queryIconHistory(row.id);
    iconHistory.value = historyData.sort((a, b) => a.version - b.version);
    selectedVersion.value = row.version; // 默认选中当前版本
    historyDialogVisible.value = true;
  } catch (error) {
    console.error('Failed to load icon history:', error);
    ElMessage.error('加载历史版本失败');
  }
};

// 处理版本回退
const handleRollback = async () => {
  if (!selectedHistoryIcon.value || !currentEditIconVO.value) return;

  await api.rollbackIcon({
    id: currentEditIconVO.value.id,
    version: selectedHistoryIcon.value.version,
  });

  ElMessage.success('版本回退成功');
  historyDialogVisible.value = false;
  getIconList(); // 刷新列表
};
</script>
