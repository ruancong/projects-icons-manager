import { http, HttpResponse, delay } from 'msw';
import { BasePageData, BaseResponse, ProjectVO, IconVO } from '~/types/api-vo-types';
import { API_PATH } from '../api';
import { BusinessCodeEnum } from '~/utils/constants';
import getEnv from '~/utils/env';

// 添加随机延迟函数
const randomDelay = () => delay(500 + Math.random() * 1000);

// 模拟数据
const mockProjects: ProjectVO[] = Array.from({ length: 87 }, (_, index) => ({
  id: index + 1 + '',
  name: `项目${index + 1}`,
  rootPath: `/data/projects/project${index + 1}`,
}));

// Mock 图标数据生成函数
const generateMockIcons = (projectId: string): IconVO[] => {
  return Array.from({ length: 38 }, (_, index) => ({
    id: index + 1,
    name: `icon_${index + 1}`,
    ossPath: `https://example.com/projects/${projectId}/icons/icon_${index + 1}.svg`,
    version: `1.0.${Math.floor(Math.random() * 10)}`,
  }));
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
    const data = mockProjects.slice(start, end);

    return HttpResponse.json<BaseResponse<BasePageData<ProjectVO>>>({
      code: BusinessCodeEnum.SUCCESS,
      data: {
        list: data,
        total: mockProjects.length,
        totalPages: Math.ceil(mockProjects.length / pageSize),
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

    const mockIcons = generateMockIcons(projectId);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = mockIcons.slice(start, end);

    return HttpResponse.json<BaseResponse<BasePageData<IconVO>>>({
      code: BusinessCodeEnum.SUCCESS,
      data: {
        list: data,
        total: mockIcons.length,
        totalPages: Math.ceil(mockIcons.length / pageSize),
      },
      msg: 'success',
    });
  }),
];
