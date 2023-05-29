"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const social_1 = require("../controllers/social");
const router = express_1.default.Router();
router.route('/:userId').get(social_1.getPosts).post(social_1.postContent);
router.route('/:userId/:postId/like').put(social_1.likePost);
router.route('/:userId/:postId/comment').put(social_1.commentPost);
router.route('/:userId/:postId/edit').put(social_1.editPost);
router.route('/connections/:userId').get(social_1.getUserSocialConnections);
router.route('/connections/:userId/addConnection').put(social_1.addUserSocialConnections);
router.route('/connections/:userId/removeConnection').put(social_1.removeUserSocialConnections);
exports.default = router;
//# sourceMappingURL=social.js.map