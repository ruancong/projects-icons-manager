import { http, HttpResponse, delay } from 'msw';
import { BasePageData, BaseResponse, ProjectVO, IconVO } from '~/types/api-vo-types';
import { API_PATH } from '../api';
import { BusinessCodeEnum } from '~/utils/constants';
import getEnv from '~/utils/env';
import { UploadIconDTO } from '~/types/api-dto-types';

// 添加随机延迟函数
const randomDelay = () => delay(500 + Math.random() * 1000);

// 模拟数据
const mockProjectsList: ProjectVO[] = Array.from({ length: 87 }, (_, index) => ({
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

  // 添加图标列表的 handler
  http.get(`${BASE_API_URL}/api/projects/:projectId/icons`, async ({ request, params }) => {
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
        total: mockProjectsList.length,
        totalPages: Math.ceil(mockProjectsList.length / pageSize),
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

  // 添加更新图标的 handler
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
];
