import { Model, Document } from 'mongoose';

/**
 * Represents a SVT
 */
export interface ISVT {
  skill: string;
  level: string;
  content: string;
  solution: string;
  requirements: string[];
  icon: string;
}

export interface ICleanSVT extends ISVT {
  id: string;
}

export interface ISVTDocument extends ISVT, Document {}

export interface ISVTModel extends Model<ISVTDocument> {}
