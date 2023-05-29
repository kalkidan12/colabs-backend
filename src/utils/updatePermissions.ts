import { Permission } from '../types';

export const updatePermissions = (permission: string, projectId: string, userPermissions: Permission) => {
  switch (permission) {
    case 'deleteProject':
      userPermissions.deleteProject.projects.push(projectId);
      break;
    case 'uploadFiles':
      userPermissions.uploadFiles.projects.push(projectId);
      break;
    case 'deleteFiles':
      userPermissions.deleteFiles.projects.push(projectId);
      break;
    case 'adminAccess':
      userPermissions.adminAccess.projects.push(projectId);
      break;
  }
};
