export type Permission = {
  adminAccess: { projects: string[] };
  uploadFiles: { projects: string[] };
  deleteFiles: { projects: string[] };
  deleteProject: { projects: string[] };
};
