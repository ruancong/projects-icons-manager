export interface BaseResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
}

export interface BasePageData<T = unknown> {
  list: T[];
  total: number;
  totalPages: number;
}

export interface ProjectVO {
  id: string;
  name: string;
  rootPath: string;
}

export interface IconVO {
  id: string;
  name: string;
  fullOssPath: string;
  version: number;
}
