import {TaskPriority} from '../models/project.model';

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  'very-low': '#b0bec5',
  'low': '#81c784',
  'medium': '#ffd54f',
  'high': '#ff8a65',
  'urgent': '#e57373',
};
