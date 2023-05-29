"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermissions = void 0;
const updatePermissions = (permission, projectId, userPermissions) => {
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
exports.updatePermissions = updatePermissions;
//# sourceMappingURL=updatePermissions.js.map