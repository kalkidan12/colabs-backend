import express from 'express';
import {
  getPosts,
  likePost,
  postContent,
  commentPost,
  editPost,
  getUserSocialConnections,
  addUserSocialConnections,
  removeUserSocialConnections,
} from '../controllers/social';

const router = express.Router();

router.route('/:userId').get(getPosts).post(postContent);

// Post routes
router.route('/:userId/:postId/like').put(likePost);
router.route('/:userId/:postId/comment').put(commentPost);
router.route('/:userId/:postId/edit').put(editPost);

// Connection routes
router.route('/connections/:userId').get(getUserSocialConnections);
router.route('/connections/:userId/addConnection').put(addUserSocialConnections);
router.route('/connections/:userId/removeConnection').put(removeUserSocialConnections);

export default router;
