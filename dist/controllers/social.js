"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserSocialConnections = exports.addUserSocialConnections = exports.getUserSocialConnections = exports.editPost = exports.commentPost = exports.likePost = exports.postContent = exports.getPosts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models");
const getPosts = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const user = await models_1.User.findById(userId);
    let tagIterator = 0;
    if (user) {
        const userPreferences = user.tags.sort((a, b) => {
            if (a.score > b.score)
                return -1;
            return 0;
        });
        new Promise(async (resolve, _reject) => {
            const posts = [];
            if (userPreferences.length > 0)
                userPreferences.forEach(async (tag) => {
                    const post = await models_1.Post.find({ tags: tag.name }).sort({ createdAt: -1 }).limit(10);
                    posts.push(post);
                    tagIterator++;
                    if (userPreferences.length === tagIterator)
                        resolve(posts);
                });
            else
                resolve(await models_1.Post.find({}).sort({ createdAt: -1 }).limit(10));
        }).then((posts) => {
            posts.length === 0
                ? res.status(204)
                : res.json({
                    posts,
                });
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getPosts = getPosts;
const postContent = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const { textContent, imageContent, tags } = req.body;
    const user = await models_1.User.findById(userId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (user) {
        errorMessage = 'Failed posting content';
        statusCode = 500;
        const post = await models_1.Post.create({ textContent, imageContent, tags: tags.split(','), userId });
        if (post) {
            res.json({
                message: 'Content Posted',
                post,
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.postContent = postContent;
const likePost = (0, express_async_handler_1.default)(async (req, res) => {
    const { postId, userId } = req.params;
    const post = await models_1.Post.findById(postId);
    let errorMessage = 'Post not found';
    let statusCode = 404;
    if (post) {
        let updatedLikes = post.likes;
        errorMessage = 'Failed to like post';
        statusCode = 500;
        if (post.likes.includes(userId)) {
            updatedLikes = [];
            post.likes.forEach((likedUserId) => {
                if (likedUserId !== userId)
                    updatedLikes.push(likedUserId);
            });
        }
        else
            updatedLikes.push(userId);
        const postLiked = await post.updateOne({ likes: updatedLikes });
        if (postLiked) {
            res.json({ message: 'Post Liked' });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.likePost = likePost;
const commentPost = (0, express_async_handler_1.default)(async (req, res) => {
    const { postId, userId } = req.params;
    const { comment } = req.body;
    const post = await models_1.Post.findById(postId);
    let errorMessage = 'Post not found';
    let statusCode = 404;
    if (post) {
        errorMessage = 'Failed to comment on post';
        statusCode = 500;
        const commentPosted = await post.updateOne({ comments: [...post.comments, { userId, comment }] });
        if (commentPosted) {
            res.json({
                message: 'Commented on post',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.commentPost = commentPost;
const editPost = (0, express_async_handler_1.default)(async (req, res) => {
    const { postId } = req.params;
    const { textContent, imageContent, tags } = req.body;
    const post = await models_1.Post.findById(postId);
    let errorMessage = 'Post not found';
    let statusCode = 404;
    if (post) {
        errorMessage = 'Failed to edit post';
        statusCode = 500;
        const postEdited = await post.updateOne({
            textContent,
            imageContent,
            tags: tags.split(','),
        });
        if (postEdited) {
            res.json({
                message: 'Post edited',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.editPost = editPost;
const getUserSocialConnections = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const user = await models_1.User.findById(userId);
    const errorMessage = 'User not found';
    const statusCode = 404;
    if (user) {
        res.json({
            connections: user.connections,
        });
        return;
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.getUserSocialConnections = getUserSocialConnections;
const addUserSocialConnections = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const { otherUserId } = req.body;
    const user = await models_1.User.findById(userId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (user) {
        errorMessage = "Failed to add connection to the user's database entry";
        statusCode = 500;
        const connectionAdded = await user.updateOne({ connections: [...user.connections, otherUserId] });
        if (connectionAdded) {
            res.json({
                message: 'User added to your connections list',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.addUserSocialConnections = addUserSocialConnections;
const removeUserSocialConnections = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const { otherUserId } = req.body;
    const user = await models_1.User.findById(userId);
    let errorMessage = 'User not found';
    let statusCode = 404;
    if (user) {
        errorMessage = "Failed to remove connection from the user's database entry";
        statusCode = 500;
        const updatedConnections = user.connections.filter((userConnectionId) => userConnectionId !== otherUserId);
        const connectionRemoved = await user.updateOne({ connections: updatedConnections });
        if (connectionRemoved) {
            res.json({
                message: 'User removed from your connections list',
            });
            return;
        }
    }
    res.status(statusCode);
    throw new Error(errorMessage);
});
exports.removeUserSocialConnections = removeUserSocialConnections;
//# sourceMappingURL=social.js.map