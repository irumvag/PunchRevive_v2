
import { PunchGrid } from '../types';
import { gridToText } from './punchEncoder';

export const decodePunchGrid = (grid: PunchGrid): string => {
  return gridToText(grid);
};
