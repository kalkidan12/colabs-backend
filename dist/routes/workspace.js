"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../utils/upload");
const workspace_1 = require("../controllers/workspace");
const router = express_1.default.Router();
router.route('/dashboard/:userId').get(workspace_1.getProjects);
router.route('/projects').post(workspace_1.createProject);
router.route('/projects/:projectId/uploadFiles').put(upload_1.fileUploadMulter.any(), workspace_1.uploadProjectFiles);
router.route('/projects/:projectId').get(workspace_1.getProjectFiles);
router.route('/projects/:projectId/:fileRef').get(workspace_1.getFileVersions);
router.route('/projects/:projectId/delete').delete(workspace_1.deleteProject);
router.route('/projects/:projectId/removeFiles').put(workspace_1.deleteProjectFiles);
router.route('/projects/:projectId/givePermission').put(workspace_1.givePermissions);
router.route('/projects/:projectId/addTask').put(workspace_1.addTasks);
router.route('/projects/:projectId/editTask').put(workspace_1.editTasks);
router.route('/projects/:projectId/deleteTask').put(workspace_1.deleteTasks);
router.route('/projects/:projectId/updateTaskStatus').put(workspace_1.updateTaskStatus);
router.route('/projects/:projectId/assignTask').put(workspace_1.assignTask);
exports.default = router;
//# sourceMappingURL=workspace.js.map