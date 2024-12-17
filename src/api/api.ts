import { RollbackIconDTO, UploadIconDTO, CreateOrUpdateProjectDTO } from '~/types/api-dto-types';
import { BasePageData, ProjectVO, IconVO, IconHistoryVO } from '~/types/api-vo-types';
import request from '~/utils/request';

export const API_PATH = {
  QUERY_PORJECTS: '/api/project/page-list',
  QUERY_PROJECT_ICONS: '/api/projects/:projectId/icons',
  ADD_ICON: '/api/icon/add',
  UPDATE_ICON: '/api/icon/update',
  QUERY_ICON_HISTORY: '/api/icon/:iconId/history',
  ROLLBACK_ICON: '/api/icon/rollback',
  DELETE_ICON: '/api/icon/delete/:iconId',
  CREATE_PROJECT: '/api/project/create',
  UPDATE_PROJECT: '/api/project/update',
  DELETE_PROJECT: '/api/project/delete/:projectId',
};

const queryPageProjects = async (
  page: number,
  pageSize: number,
  name?: string,
): Promise<BasePageData<ProjectVO>> => {
  const result = await request.get<BasePageData<ProjectVO>>(API_PATH.QUERY_PORJECTS, {
    page,
    pageSize,
    name,
  });
  return result;
};

const queryProjectIcons = async (
  projectId: string,
  page: number,
  pageSize: number,
): Promise<BasePageData<IconVO>> => {
  const url = API_PATH.QUERY_PROJECT_ICONS;
  const result = await request.getWithPathParams<BasePageData<IconVO>>(url, {
    projectId,
  }, {
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

const rollbackIcon = async (rollbackIconDTO: RollbackIconDTO) => {
  return request.post(API_PATH.ROLLBACK_ICON, rollbackIconDTO);
};

const deleteIcon = async (iconId: string) => {
  return request.postWithPathParams(API_PATH.DELETE_ICON, { iconId });
};

const createProject = async (createProjectDTO: CreateOrUpdateProjectDTO) => {
  return request.post(API_PATH.CREATE_PROJECT, createProjectDTO);
};

/**
 * 更新项目信息
 */
const updateProject = async (dto: CreateOrUpdateProjectDTO) => {
  return request.post<void>('/api/project/update', dto);
};

/**
 * 删除项目
 */
const deleteProject = async (projectId: string) => {
  return request.postWithPathParams<void>(API_PATH.DELETE_PROJECT, { projectId });
};

export default {
  queryPageProjects,
  queryProjectIcons,
  addIcon,
  updateIcon,
  queryIconHistory,
  rollbackIcon,
  deleteIcon,
  createProject,
  updateProject,
  deleteProject,
};
