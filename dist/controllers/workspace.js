"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTask = exports.updateTaskStatus = exports.deleteTasks = exports.editTasks = exports.addTasks = exports.getFileVersions = exports.getProjectFiles = exports.givePermissions = exports.deleteProjectFiles = exports.uploadProjectFiles = exports.deleteProject = exports.createProject = exports.getProjects = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models/");
const octokit_1 = require("octokit");
const fs = __importStar(require("fs/promises"));
const updatePermissions_1 = require("../utils/updatePermissions");
const getProjects = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const repositories = await models_1.Repository.find({ owner: userId });
    if (repositories) {
        res.json({
            projects: repositories,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getProjects = getProjects;
const getProjectFiles = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const repository = await models_1.Repository.findById(projectId);
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    if (repository) {
        const commits = await client.request(`GET /repos/${process.env.GITHUB_ORGANIZATION}/${repository.name}/commits`);
        res.json({
            files: repository,
            commits,
        });
    }
    else {
        res.status(404);
        throw new Error('Project not found');
    }
});
exports.getProjectFiles = getProjectFiles;
const getFileVersions = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId, fileRef } = req.params;
    const repository = await models_1.Repository.findById(projectId);
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    if (repository) {
        const files = await client.request(`GET /repos/${process.env.GITHUB_ORGANIZATION}/${repository.name}/commits/${fileRef}`);
        res.json({
            files,
        });
    }
    else {
        res.status(404);
        throw new Error('Project not found');
    }
});
exports.getFileVersions = getFileVersions;
const createProject = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId, projectName } = req.body;
    const user = await models_1.Freelancer.findById(userId);
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    let errorMessage = 'User not found';
    if (user) {
        errorMessage = 'Project Creation Failed';
        const repoResponse = await client.request(`POST /orgs/${process.env.GITHUB_ORGANIZATION}/repos`, {
            name: projectName,
            homepage: 'https://github.com',
            private: true,
        });
        if (repoResponse.status === 201) {
            const repository = await models_1.Repository.create({ name: projectName, owner: userId });
            if (repository) {
                const permissions = user.permissions;
                permissions.adminAccess.projects.push(repository.id);
                permissions.deleteFiles.projects.push(repository.id);
                permissions.uploadFiles.projects.push(repository.id);
                permissions.deleteProject.projects.push(repository.id);
                await user.updateOne({ permissions });
                res.json({
                    message: `${projectName} is successfully created.`,
                });
                return;
            }
        }
    }
    res.status(404);
    throw new Error(errorMessage);
});
exports.createProject = createProject;
const deleteProject = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { projectName, workerId } = req.body;
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const worker = await models_1.Freelancer.findById(workerId);
    let errorMessage = 'User not found';
    let errorStatusCode = 404;
    if (worker) {
        errorMessage = 'You do not have access to delete this project.';
        errorStatusCode = 401;
        if (worker.permissions.deleteProject.projects.includes(projectId)) {
            const repoResponse = await client.request(`DELETE /repos/${process.env.GITHUB_ORGANIZATION}/${projectName}`);
            errorMessage = 'Failed Request';
            if (repoResponse.status === 204) {
                const project = await models_1.Repository.findByIdAndDelete(projectId);
                errorMessage = 'Project not found';
                if (project) {
                    res.json({
                        message: `${project.name} is successfully deleted.`,
                    });
                    return;
                }
            }
        }
    }
    res.status(errorStatusCode);
    throw new Error(errorMessage);
});
exports.deleteProject = deleteProject;
const uploadProjectFiles = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const { projectId } = req.params;
    const { projectName, commitMessage, workerId } = req.body;
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const files = Array.from(((_a = req.files) !== null && _a !== void 0 ? _a : []));
    const worker = await models_1.Freelancer.findById(workerId);
    const project = await models_1.Repository.findById(projectId);
    const uploadedFiles = [];
    let fileIterator = 0;
    if (worker && project) {
        if (worker.permissions.uploadFiles.projects.includes(projectId)) {
            new Promise((resolve, reject) => {
                files.forEach(async (f) => {
                    const file = JSON.parse(JSON.stringify(f));
                    const content = await fs.readFile(file.path, { encoding: 'base64' });
                    let fileSha = '';
                    project.files.forEach((projectFile) => {
                        if (projectFile.fileName === file.originalname) {
                            fileSha = projectFile.sha;
                            return;
                        }
                    });
                    const uploadResponse = await client.request(`PUT /repos/${process.env.GITHUB_ORGANIZATION}/${projectName}/contents/${file.originalname}`, {
                        message: commitMessage,
                        committer: {
                            name: `${worker.firstName} ${worker.lastName}`,
                            email: worker.email,
                        },
                        sha: fileSha,
                        content,
                    });
                    if (uploadResponse) {
                        fileIterator++;
                        const fileReference = { fileName: uploadResponse.data.content.name, sha: uploadResponse.data.content.sha };
                        let fileExists = false;
                        project.files.forEach((projectFile) => {
                            if (projectFile.fileName === fileReference.fileName) {
                                fileExists = true;
                                return;
                            }
                        });
                        if (!fileExists)
                            uploadedFiles.push(fileReference);
                        if (fileIterator === files.length)
                            resolve(true);
                    }
                    else
                        reject('File Upload request failed');
                });
                if (files.length === 0)
                    reject('Files not uploaded');
            })
                .then(async () => {
                const databaseFilesUpadted = await project.updateOne({ files: [...project.files, ...uploadedFiles] });
                if (databaseFilesUpadted) {
                    res.json({
                        message: `Files are uploaded successfully.`,
                    });
                    return;
                }
                else {
                    res.status(500);
                    throw new Error('Failed to store file references in database');
                }
            })
                .catch((error) => {
                res.status(500).json({ error });
                throw new Error(error);
            })
                .finally(() => {
                files.forEach((f) => {
                    const file = JSON.parse(JSON.stringify(f));
                    fs.unlink(file.path);
                });
            });
        }
        else {
            res.status(401);
            throw new Error('You do not have access to upload files to this project.');
        }
    }
    else {
        res.status(404);
        throw new Error(worker ? 'Project not found' : 'User not found');
    }
});
exports.uploadProjectFiles = uploadProjectFiles;
const deleteProjectFiles = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { projectName, files, workerId, commitMessage } = req.body;
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const worker = await models_1.Freelancer.findById(workerId);
    const project = await models_1.Repository.findById(projectId);
    const filesToBeDeleted = files.split(',');
    let fileSha = '';
    let fileIterator = 0;
    if (worker && project) {
        if (worker.permissions.uploadFiles.projects.includes(projectId)) {
            new Promise((resolve, reject) => {
                filesToBeDeleted.forEach(async (fileName) => {
                    project.files.forEach((projectFile) => {
                        if (projectFile.fileName === fileName) {
                            fileSha = projectFile.sha;
                            return;
                        }
                    });
                    const deleteResponse = await client.request(`DELETE /repos/${process.env.GITHUB_ORGANIZATION}/${projectName}/contents/${fileName}`, {
                        message: commitMessage,
                        committer: {
                            name: `${worker.firstName} ${worker.lastName}`,
                            email: worker.email,
                        },
                        sha: fileSha,
                    });
                    if (deleteResponse) {
                        fileIterator++;
                        if (fileIterator === filesToBeDeleted.length)
                            resolve(true);
                    }
                    else
                        reject('File Upload request failed');
                });
            })
                .then(async () => {
                const unremovedFiles = [];
                project.files.forEach((file) => {
                    if (!filesToBeDeleted.includes(file.fileName))
                        unremovedFiles.push(file);
                });
                const databaseFilesUpadted = await project.updateOne({ files: unremovedFiles });
                if (databaseFilesUpadted) {
                    res.json({
                        message: `Files are deleted successfully.`,
                    });
                    return;
                }
                else {
                    res.status(500);
                    throw new Error('Failed to delete file references in database');
                }
            })
                .catch((error) => {
                res.status(500);
                throw new Error(error);
            });
        }
        else {
            res.status(401);
            throw new Error('You do not have access to delete files to this project.');
        }
    }
    else {
        res.status(404);
        throw new Error(worker ? 'Project not found' : 'User not found');
    }
});
exports.deleteProjectFiles = deleteProjectFiles;
const givePermissions = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { ownerId, memberId, permission } = req.body;
    const owner = await models_1.Freelancer.findById(ownerId);
    const member = await models_1.Freelancer.findById(memberId);
    let errorMessage = 'Users not found';
    let statusCode = 404;
    if (owner && member) {
        errorMessage = 'You do not have access to delete files to this project.';
        statusCode = 401;
        if (owner.permissions.adminAccess.projects.includes(projectId)) {
            const memberPermissions = member.permissions;
            errorMessage = `Failed assigning permissions to ${member.firstName} ${member.lastName}`;
            statusCode = 500;
            (0, updatePermissions_1.updatePermissions)(permission, projectId, memberPermissions);
            const dbRespnse = await member.updateOne({ permissions: memberPermissions });
            if (dbRespnse) {
                res.json({
                    message: `${member.firstName} ${member.lastName} has acquired new permissions to this project.`,
                });
                return;
            }
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.givePermissions = givePermissions;
const addTasks = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { newTask } = req.body;
    const project = await models_1.Repository.findById(projectId);
    let errorMessage = 'Project not found';
    let statusCode = 404;
    if (project) {
        errorMessage = 'Failed to update project';
        statusCode = 500;
        const newTaskJSON = JSON.parse(JSON.stringify(newTask));
        const taskName = newTaskJSON.title.replace(' ', '_');
        newTaskJSON.id = `${project.name}-${taskName}${newTaskJSON.deadline}`;
        const tasksUpdated = await project.updateOne({ tasks: [...project.tasks, newTaskJSON] });
        if (tasksUpdated) {
            res.json({
                message: 'Tasks added to the project',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.addTasks = addTasks;
const editTasks = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { editedTask } = req.body;
    const project = await models_1.Repository.findById(projectId);
    let errorMessage = 'Project not found';
    let statusCode = 404;
    if (project) {
        errorMessage = 'Failed to update project task';
        statusCode = 500;
        const editedTaskJSON = JSON.parse(JSON.stringify(editedTask));
        const editedTasks = project.tasks.map((task) => {
            if (task.id === editedTaskJSON.id)
                return editedTaskJSON;
            return task;
        });
        const tasksUpdated = await project.updateOne({ tasks: editedTasks });
        if (tasksUpdated) {
            res.json({
                message: 'Task edited',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.editTasks = editTasks;
const deleteTasks = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { taskId } = req.body;
    const project = await models_1.Repository.findById(projectId);
    let errorMessage = 'Project not found';
    let statusCode = 404;
    if (project) {
        errorMessage = 'Task not found';
        statusCode = 404;
        let taskExists = false;
        project.tasks.forEach((task) => {
            if (task.id === taskId)
                taskExists = true;
        });
        if (taskExists) {
            errorMessage = 'Failed to remove project task';
            statusCode = 500;
            const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
            const tasksUpdated = await project.updateOne({ tasks: updatedTasks });
            if (tasksUpdated) {
                console.log(tasksUpdated);
                res.json({
                    message: 'Task removed',
                });
                return;
            }
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.deleteTasks = deleteTasks;
const updateTaskStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { taskId, status } = req.body;
    const project = await models_1.Repository.findById(projectId);
    let errorMessage = 'Project not found';
    let statusCode = 404;
    if (project) {
        errorMessage = 'Failed to update project';
        statusCode = 500;
        const updatedTasks = project.tasks.map((task) => {
            if (task.id === taskId) {
                task.status = status;
                return task;
            }
            else
                return task;
        });
        const taskUpdated = await project.updateOne({ tasks: updatedTasks });
        if (taskUpdated) {
            res.json({
                message: 'Task status changed',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.updateTaskStatus = updateTaskStatus;
const assignTask = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const { taskId, assignees } = req.body;
    const project = await models_1.Repository.findById(projectId);
    let errorMessage = 'Project not found';
    let statusCode = 404;
    if (project) {
        errorMessage = 'Failed to assign task to users';
        statusCode = 500;
        const assigneesIds = assignees.split(',');
        const updatedAssignees = project.tasks.map((task) => {
            if (task.id === taskId)
                task.assignees = assigneesIds;
            return task;
        });
        const updatedTask = await project.updateOne({ tasks: updatedAssignees });
        if (updatedTask) {
            errorMessage = 'Notification Request Failed';
            const pendingNotifications = assigneesIds.map((assigneeId) => {
                return {
                    title: `Task Assigned`,
                    message: `A new task has been assigned to you in the ${project.name} workspace`,
                    userId: assigneeId,
                };
            });
            const notification = await models_1.Notification.insertMany(pendingNotifications);
            if (notification) {
                res.json({ message: 'Task assigned' });
                return;
            }
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.assignTask = assignTask;
//# sourceMappingURL=workspace.js.map