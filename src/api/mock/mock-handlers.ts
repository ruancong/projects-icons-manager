import { http, HttpResponse, delay } from 'msw';
import { BasePageData, BaseResponse, ProjectVO, IconVO, IconHistoryVO } from '~/types/api-vo-types';
import { API_PATH } from '../api';
import { BusinessCodeEnum } from '~/utils/constants';
import getEnv from '~/utils/env';
import { RollbackIconDTO, UploadIconDTO, CreateProjectDTO } from '~/types/api-dto-types';

// 随机延迟函数
const randomDelay = () => delay(500 + Math.random() * 1000);

// 模拟数据
const mockProjectsList: ProjectVO[] = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1 + '',
  name: `项目${index + 1}`,
  rootPath: `/data/projects/project${index + 1}`,
}));

// Mock 图标数据生成函数
// 生成随机的8位projectId
const projectId = Math.random().toString(36).substring(2, 10);
const mockIconsList: IconVO[] = Array.from({ length: 38 }, (_, index) => ({
  id: index + 1 + '',
  name: `icon_${index + 1}`,
  // https://robohash.org/112122212.png?size=40x40
  fullOssPath: `https://robohash.org/${projectId}-${index + 1}.png?size=40x40`,
  version: 1,
}));

// 模拟的历史版本数据生成函数
const generateMockIconHistory = (iconId: string): IconHistoryVO[] => {
  const versions = Array.from({ length: 3 }, (_, index) => ({
    id: `${iconId}-history-${index + 1}`,
    version: index + 1,
    fullOssPath: `https://robohash.org/${iconId}-v${index + 1}?size=40x40`,
    // 修改时间格式为 yyyy-MM-dd HH:mm:ss
    createTime: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  }));
  return versions.reverse(); // 返回倒���，最新的在最前
};

const { BASE_API_URL } = getEnv();

export const handlers = [
  http.get(`${BASE_API_URL}${API_PATH.QUERY_PORJECTS}`, async ({ request }) => {
    await randomDelay(); // 使用随机延迟

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = mockProjectsList.slice(start, end);

    return HttpResponse.json<BaseResponse<BasePageData<ProjectVO>>>({
      code: BusinessCodeEnum.SUCCESS,
      data: {
        list: data,
        total: mockProjectsList.length,
        totalPages: Math.ceil(mockProjectsList.length / pageSize),
      },
      msg: 'success',
    });
  }),

  // 项目图标列表的 handler
  http.get(`${BASE_API_URL}${API_PATH.QUERY_PROJECT_ICONS}`, async ({ request, params }) => {
    await randomDelay();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const projectId = params.projectId as string;
    console.log('projectId', projectId);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = mockIconsList.slice(start, end);

    return HttpResponse.json<BaseResponse<BasePageData<IconVO>>>({
      code: BusinessCodeEnum.SUCCESS,
      data: {
        list: data,
        total: mockIconsList.length,
        totalPages: Math.ceil(mockIconsList.length / pageSize),
      },
      msg: 'success',
    });
  }),

  // Add new handler for icon upload
  http.post(`${BASE_API_URL}${API_PATH.ADD_ICON}`, async ({ request }) => {
    await randomDelay();

    const uploadIconDTO = (await request.json()) as UploadIconDTO;
    console.log('uploadIconDTO', uploadIconDTO);

    // Add the new icon to the mock data
    mockIconsList.unshift({
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      name: uploadIconDTO.name,
      fullOssPath: `https://robohash.org/${uploadIconDTO.ossPath}?size=40x40`,
      version: 1,
    });

    // Mock a successful response
    return HttpResponse.json<BaseResponse<null>>({
      code: BusinessCodeEnum.SUCCESS,
      data: null,
      msg: 'scucess',
    });
  }),

  // 更新图标的 handler
  http.post(`${BASE_API_URL}${API_PATH.UPDATE_ICON}`, async ({ request }) => {
    await randomDelay();

    const uploadIconDTO = (await request.json()) as UploadIconDTO;

    // 在 mock 数据中查找并更新图标
    const iconIndex = mockIconsList.findIndex((icon) => icon.id === uploadIconDTO.id);
    if (iconIndex !== -1) {
      mockIconsList[iconIndex] = {
        ...mockIconsList[iconIndex],
        name: uploadIconDTO.name,
        fullOssPath: uploadIconDTO.ossPath
          ? `https://robohash.org/${uploadIconDTO.ossPath}?size=40x40`
          : mockIconsList[iconIndex].fullOssPath,
        version: mockIconsList[iconIndex].version + 1,
      };
    }

    return HttpResponse.json<BaseResponse<null>>({
      code: BusinessCodeEnum.SUCCESS,
      data: null,
      msg: 'success',
    });
  }),

  // 查询图标历史版本的 handler
  http.get(`${BASE_API_URL}${API_PATH.QUERY_ICON_HISTORY}`, async ({ params }) => {
    await randomDelay();
    const iconId = params.iconId as string;
    const historyData = generateMockIconHistory(iconId);

    return HttpResponse.json<BaseResponse<IconHistoryVO[]>>({
      code: BusinessCodeEnum.SUCCESS,
      data: historyData,
      msg: 'success',
    });
  }),

  // 版本回退的 handler
  http.post(`${BASE_API_URL}${API_PATH.ROLLBACK_ICON}`, async ({ request }) => {
    await randomDelay();

    const rollbackIconDTO = (await request.json()) as RollbackIconDTO;

    // 在 mock 数据中查找并更新图标
    const iconIndex = mockIconsList.findIndex((icon) => icon.id === rollbackIconDTO.id);
    if (iconIndex !== -1) {
      // 模拟回退操作，将版本号更新为回退的版本
      mockIconsList[iconIndex] = {
        ...mockIconsList[iconIndex],
        version: rollbackIconDTO.version,
      };
    }

    return HttpResponse.json<BaseResponse<null>>({
      code: BusinessCodeEnum.SUCCESS,
      data: null,
      msg: 'success',
    });
  }),

  // 删除图标的 handler
  http.post(`${BASE_API_URL}${API_PATH.DELETE_ICON}`, async ({ params }) => {
    await randomDelay();

    const iconId = params.iconId as string;
    // 在 mock 数据中查找并删除图标
    const iconIndex = mockIconsList.findIndex((icon) => icon.id === iconId);
    if (iconIndex !== -1) {
      mockIconsList.splice(iconIndex, 1);
    }

    return HttpResponse.json<BaseResponse<null>>({
      code: BusinessCodeEnum.SUCCESS,
      data: null,
      msg: 'success',
    });
  }),

  // 创建项目的 handler
  http.post(`${BASE_API_URL}${API_PATH.CREATE_PROJECT}`, async ({ request }) => {
    await randomDelay();

    const createProjectDTO = (await request.json()) as CreateProjectDTO;

    // 生成新的项目ID
    const newId = (mockProjectsList.length + 1).toString();
    
    // 添加新项目到mock数据中
    mockProjectsList.unshift({
      id: newId,
      name: createProjectDTO.name,
      rootPath: createProjectDTO.rootPath,
    });

    return HttpResponse.json<BaseResponse<null>>({
      code: BusinessCodeEnum.SUCCESS,
      data: null,
      msg: 'success',
    });
  }),
];
