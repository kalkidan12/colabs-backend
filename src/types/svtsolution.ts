import { Model, Document } from 'mongoose';

/**
 * Represents a SVT
 */
export interface ISVTSolution {
  skillId: string;
  userId: string;
  solution: string;
  score: number;
  status: string;
}

export interface ICleanSVTSolution extends ISVTSolution {
  id: string;
}

export interface ISVTSolutionDocument extends ISVTSolution, Document {}

export interface ISVTSolutionModel extends Model<ISVTSolutionDocument> {}
