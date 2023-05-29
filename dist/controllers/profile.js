"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreSolution = exports.getPendingSolutions = exports.addSVT = exports.submitSolution = exports.getSVTs = exports.editProfile = exports.getProfile = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models");
const getProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const user = await models_1.User.findById(userId);
    if (user) {
        res.json({
            profile: user,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getProfile = getProfile;
const editProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const { data } = req.body;
    const user = await models_1.User.findById(userId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (user) {
        const userUpdated = await user.updateOne(JSON.parse(JSON.stringify(data)));
        errorMessage = 'Failed to update profile';
        statusCode = 500;
        if (userUpdated) {
            res.json({
                message: 'User has been updated.',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.editProfile = editProfile;
const getSVTs = (0, express_async_handler_1.default)(async (req, res) => {
    const { svtFilter } = req.params;
    const svts = await models_1.SVT.find(svtFilter === 'all' ? {} : { skill: svtFilter });
    if (svts) {
        res.json({
            svts,
        });
    }
    else {
        res.status(404);
        throw new Error('SVTs not found');
    }
});
exports.getSVTs = getSVTs;
const submitSolution = (0, express_async_handler_1.default)(async (req, res) => {
    const { svtId } = req.params;
    const { solution, userId } = req.body;
    const solutionSubmitted = await models_1.SVTSolution.create({
        svtId,
        userId,
        solution,
    });
    if (solutionSubmitted) {
        res.json({
            message: 'You have submitted your answer.',
        });
    }
    else {
        res.status(404);
        throw new Error('SVTs not found');
    }
});
exports.submitSolution = submitSolution;
const addSVT = (0, express_async_handler_1.default)(async (req, res) => {
    const { regulatorId } = req.params;
    const { skill, level, content, solution, requirements, icon } = req.body;
    const regulator = await models_1.User.findById(regulatorId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (regulator) {
        errorMessage = 'You do not have access to this service.';
        statusCode = 401;
        if (regulator.isRegulator) {
            const svt = await models_1.SVT.create({
                skill,
                level,
                content,
                solution,
                requirements: requirements.split(','),
                icon,
            });
            if (svt) {
                errorMessage = 'Failed to create SVT';
                statusCode = 500;
                res.json({
                    message: 'SVT added to database.',
                });
                return;
            }
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.addSVT = addSVT;
const getPendingSolutions = (0, express_async_handler_1.default)(async (req, res) => {
    const { recruiterId: regulatorId } = req.params;
    const regulator = await models_1.User.findById(regulatorId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (regulator) {
        errorMessage = 'You do not have access to this service.';
        statusCode = 401;
        if (regulator.isRegulator) {
            errorMessage = 'Failed to retrieve solutions';
            statusCode = 500;
            const solutions = await models_1.SVTSolution.find({ status: 'Pending' });
            if (solutions) {
                res.json({
                    pendingSolutions: solutions,
                });
                return;
            }
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.getPendingSolutions = getPendingSolutions;
const scoreSolution = (0, express_async_handler_1.default)(async (req, res) => {
    const { regulatorId, solutionId } = req.params;
    const { score } = req.body;
    const regulator = await models_1.User.findById(regulatorId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (regulator) {
        errorMessage = 'You do not have access to this service.';
        statusCode = 401;
        if (regulator.isRegulator) {
            errorMessage = 'Failed to score solution';
            statusCode = 500;
            const solution = await models_1.SVTSolution.findByIdAndUpdate(solutionId, { score });
            if (solution) {
                const worker = await models_1.Freelancer.findById(solution.userId);
                errorMessage = 'Worker not found';
                statusCode = 404;
                if (worker) {
                    errorMessage = 'Notification request failed';
                    statusCode = 500;
                    await models_1.Freelancer.updateOne({ skills: [...worker.skills, solution.skillId] });
                    const svt = await models_1.SVT.findById(solution.skillId);
                    const notification = await models_1.Notification.create({
                        title: 'Solution Scored',
                        message: `The ${svt === null || svt === void 0 ? void 0 : svt.skill} SVT you took earlier has been scored.`,
                        userId: solution.userId,
                    });
                    if (notification) {
                        res.json({
                            message: 'The solution has been scored',
                        });
                        return;
                    }
                }
            }
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.scoreSolution = scoreSolution;
//# sourceMappingURL=profile.js.map