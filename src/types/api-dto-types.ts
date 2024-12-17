export interface UploadIconDTO {
  name: string;
  projectId: string;
  ossPath?: string;
  id?: string;
}

export interface RollbackIconDTO {
  id: string;
  version: number;
}

export interface CreateOrUpdateProjectDTO {
  id?: string;
  name?: string;
  rootPath?: string;
}
