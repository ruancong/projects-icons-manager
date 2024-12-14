import { ProjectVO } from '~/types/api-vo-types';
import request from '~/utils/request';

export const API_PATH = {
  QUERY_PORJECTS: '/api/project/page-list',
};

const queryPageProjects = async (page: number, pageSize: number): Promise<ProjectVO[]> => {
  const result = await request.get<ProjectVO[]>(API_PATH.QUERY_PORJECTS, {
    page,
    pageSize,
  });
  return result;
};

export default { queryPageProjects };
