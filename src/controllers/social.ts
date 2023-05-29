import { Request, Response } from '../types/express';
import asyncHandler from 'express-async-handler';
import { User, Post } from '../models';
import { Tag } from '../types';

/**
 * Get Posts
 * @route GET /api/v1/social/:userId
 * @access Public
 */
const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const user = await User.findById(userId);
  let tagIterator = 0;

  if (user) {
    const userPreferences = user.tags.sort((a: Tag, b: Tag) => {
      if (a.score > b.score) return -1;
      return 0;
    });
    // TODO: Test fetching content Limit
    new Promise(async (resolve, _reject) => {
      const posts: any = [];

      if (userPreferences.length > 0)
        userPreferences.forEach(async (tag) => {
          const post = await Post.find({ tags: tag.name }).sort({ createdAt: -1 }).limit(10);

          posts.push(post);
          tagIterator++;

          if (userPreferences.length === tagIterator) resolve(posts);
        });
      else resolve(await Post.find({}).sort({ createdAt: -1 }).limit(10));
    }).then((posts: any) => {
      posts.length === 0
        ? res.status(204)
        : res.json({
            posts,
          });
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Post Content
 * @route POST /api/v1/social/:userId
 * @access Public
 */
const postContent = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { textContent, imageContent, tags } = req.body as { textContent?: string; imageContent?: string; tags: string };
  const user = await User.findById(userId);

  let errorMessage = 'User not found';
  let statusCode = 404;

  if (user) {
    errorMessage = 'Failed posting content';
    statusCode = 500;

    const post = await Post.create({ textContent, imageContent, tags: tags.split(','), userId });

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

/**
 * Like Post
 * @route PUt /api/v1/social/:userId/:postId/like
 * @access Public
 */
const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { postId, userId } = req.params as { postId: string; userId: string };
  const post = await Post.findById(postId);

  let errorMessage = 'Post not found';
  let statusCode = 404;

  if (post) {
    let updatedLikes = post.likes;
    errorMessage = 'Failed to like post';
    statusCode = 500;

    if (post.likes.includes(userId)) {
      updatedLikes = [];

      post.likes.forEach((likedUserId) => {
        if (likedUserId !== userId) updatedLikes.push(likedUserId);
      });
    } else updatedLikes.push(userId);

    const postLiked = await post.updateOne({ likes: updatedLikes });

    if (postLiked) {
      res.json({ message: 'Post Liked' });
      return;
    }
  }

  res.status(statusCode);
  throw new Error(errorMessage);
});

/**
 * Comment on Post
 * @route PUt /api/v1/social/:userId/:postId/comment
 * @access Public
 */
const commentPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId, userId } = req.params as { postId: string; userId: string };
  const { comment } = req.body as { comment: string };
  const post = await Post.findById(postId);

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

/**
 * Edit Post
 * @route PUt /api/v1/social/:userId/:postId/edit
 * @access Public
 */
const editPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  const { textContent, imageContent, tags } = req.body as { textContent?: string; imageContent?: string; tags: string };
  const post = await Post.findById(postId);

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

/**
 * Get user's connections
 * @route GET /api/v1/social/connections/:userId
 * @access Private
 */
const getUserSocialConnections = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const user = await User.findById(userId);

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

/**
 * Add other user to the user's connections
 * @route PUT /api/v1/social/connections/:userId/addConnection
 * @access Private
 */
const addUserSocialConnections = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { otherUserId } = req.body as { otherUserId: string };
  const user = await User.findById(userId);

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

/**
 * Remove other user from the user's connections
 * @route PUT /api/v1/social/connections/:userId/removeConnection
 * @access Private
 */
const removeUserSocialConnections = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { otherUserId } = req.body as { otherUserId: string };
  const user = await User.findById(userId);

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

// TODO: donate to creator
export {
  getPosts,
  postContent,
  likePost,
  commentPost,
  editPost,
  getUserSocialConnections,
  addUserSocialConnections,
  removeUserSocialConnections,
};
