import { Request, Response } from '../types/express';
import asyncHandler from 'express-async-handler';
import { User, SVT, SVTSolution, Notification, Freelancer } from '../models';

/**
 * Get Profile
 * @route GET /api/v1/profile/:userId
 * @access Private
 */
const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const user = await User.findById(userId);

  if (user) {
    res.json({
      profile: user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Edit Profile
 * @route PUT /api/v1/profile/:userId
 * @access Private
 */
const editProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { data } = req.body as { data: string };
  const user = await User.findById(userId);

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

/**
 * Provide SVTs
 * @route GET /api/v1/profile/:skill
 * @access Private
 */
const getSVTs = asyncHandler(async (req: Request, res: Response) => {
  const { svtFilter } = req.params as { svtFilter: string };
  const svts = await SVT.find(svtFilter === 'all' ? {} : { skill: svtFilter });

  if (svts) {
    res.json({
      svts,
    });
  } else {
    res.status(404);
    throw new Error('SVTs not found');
  }
});

/**
 * Submitting answers for the given SVT
 * @route POST /api/v1/profile/:svtId/submit
 * @access Private
 */
// TODO: Test
const submitSolution = asyncHandler(async (req: Request, res: Response) => {
  const { svtId } = req.params as { svtId: string };
  const { solution, userId } = req.body as { solution: string; userId: string };
  const solutionSubmitted = await SVTSolution.create({
    svtId,
    userId,
    solution,
  });

  if (solutionSubmitted) {
    res.json({
      message: 'You have submitted your answer.',
    });
  } else {
    res.status(404);
    throw new Error('SVTs not found');
  }
});

/**
 * Adding SVT to database
 * @route POST /api/v1/profile/skills/:regulatorId/addSVT
 * @access Private
 */
// TODO: Test
const addSVT = asyncHandler(async (req: Request, res: Response) => {
  const { regulatorId } = req.params as { regulatorId: string };
  const { skill, level, content, solution, requirements, icon } = req.body as {
    skill: string;
    level: string;
    content: string;
    solution: string;
    requirements: string;
    icon: string;
  };
  const regulator = await User.findById(regulatorId);
  let errorMessage = 'User not found';
  let statusCode = 404;

  if (regulator) {
    errorMessage = 'You do not have access to this service.';
    statusCode = 401;

    if (regulator.isRegulator) {
      const svt = await SVT.create({
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

/**
 * Get solutions for reviewing by regulator
 * @route GET /api/v1/profile/skills/:regulatorId/solutions
 * @access Private
 */
// TODO: Test
const getPendingSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { recruiterId: regulatorId } = req.params as { recruiterId: string };
  const regulator = await User.findById(regulatorId);
  let errorMessage = 'User not found';
  let statusCode = 404;

  if (regulator) {
    errorMessage = 'You do not have access to this service.';
    statusCode = 401;

    if (regulator.isRegulator) {
      errorMessage = 'Failed to retrieve solutions';
      statusCode = 500;

      const solutions = await SVTSolution.find({ status: 'Pending' });

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

/**
 * Score a solution
 * @route GET /api/v1/profile/skills/:regulatorId/solutions/:solutionId/score
 * @access Private
 */
// TODO: Test
const scoreSolution = asyncHandler(async (req: Request, res: Response) => {
  const { regulatorId, solutionId } = req.params as { regulatorId: string; solutionId: string };
  const { score } = req.body as { score: number };
  const regulator = await User.findById(regulatorId);

  let errorMessage = 'User not found';
  let statusCode = 404;

  if (regulator) {
    errorMessage = 'You do not have access to this service.';
    statusCode = 401;

    if (regulator.isRegulator) {
      errorMessage = 'Failed to score solution';
      statusCode = 500;
      const solution = await SVTSolution.findByIdAndUpdate(solutionId, { score });

      if (solution) {
        const worker = await Freelancer.findById(solution.userId);
        errorMessage = 'Worker not found';
        statusCode = 404;

        if (worker) {
          errorMessage = 'Notification request failed';
          statusCode = 500;

          await Freelancer.updateOne({ skills: [...worker.skills, solution.skillId] });
          const svt = await SVT.findById(solution.skillId);
          const notification = await Notification.create({
            title: 'Solution Scored',
            message: `The ${svt?.skill} SVT you took earlier has been scored.`,
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

// TODO: Award badges for achievements
export { getProfile, editProfile, getSVTs, submitSolution, addSVT, getPendingSolutions, scoreSolution };
