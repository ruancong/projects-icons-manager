import { UploadIconDTO } from '~/types/api-dto-types';
import { BasePageData, ProjectVO, IconVO, IconHistoryVO } from '~/types/api-vo-types';
import request from '~/utils/request';

export const API_PATH = {
  QUERY_PORJECTS: '/api/project/page-list',
  QUERY_PROJECT_ICONS: '/api/projects/:projectId/icons',
  ADD_ICON: '/api/icon/add',
  UPDATE_ICON: '/api/icon/update',
  QUERY_ICON_HISTORY: '/api/icon/:iconId/history',
};

const queryPageProjects = async (
  page: number,
  pageSize: number,
): Promise<BasePageData<ProjectVO>> => {
  const result = await request.get<BasePageData<ProjectVO>>(API_PATH.QUERY_PORJECTS, {
    page,
    pageSize,
  });
  return result;
};

const queryProjectIcons = async (
  projectId: string,
  page: number,
  pageSize: number,
): Promise<BasePageData<IconVO>> => {
  const url = API_PATH.QUERY_PROJECT_ICONS.replace(':projectId', projectId);
  const result = await request.get<BasePageData<IconVO>>(url, {
    page,
    pageSize,
  });
  return result;
};

const addIcon = async (uploadIconDTO: UploadIconDTO) => {
  return request.post(API_PATH.ADD_ICON, uploadIconDTO);
};

const updateIcon = async (uploadIconDTO: UploadIconDTO) => {
  return request.post(API_PATH.UPDATE_ICON, uploadIconDTO);
};

const queryIconHistory = async (iconId: string): Promise<IconHistoryVO[]> => {
  const result = await request.getWithPathParams<IconHistoryVO[]>(API_PATH.QUERY_ICON_HISTORY, {
    iconId,
  });
  return result;
};

export default { queryPageProjects, queryProjectIcons, addIcon, updateIcon, queryIconHistory };
