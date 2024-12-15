import { http, HttpResponse } from 'msw';
import { BasePageData, BaseResponse, ProjectVO } from '~/types/api-vo-types';
import { API_PATH } from '../api';
import { BusinessCodeEnum } from '~/utils/constants';

// 模拟数据
const mockProjects: ProjectVO[] = Array.from({ length: 87 }, (_, index) => ({
  id: index + 1 + '',
  name: `项目${index + 1}`,
  rootPath: `/data/projects/project${index + 1}`,
}));

export const handlers = [
  http.get(API_PATH.QUERY_PORJECTS, ({ request }) => {
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
];
