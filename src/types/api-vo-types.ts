export interface BaseResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
}

export interface ProjectVO {
  id: string;
  name: string;
  rootPath: string;
}
