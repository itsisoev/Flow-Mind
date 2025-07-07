import {IUser} from './user.model';

export type TaskPriority = 'very-low' | 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface ITask {
  uuid?: string;
  title: string;
  description?: string;
  done?: boolean;
  priority?: TaskPriority;
  term?: Date;
  status?: TaskStatus;
  owner:  IUser;
}

export interface IProject {
  uuid: string;
  title: string;
  tasks: ITask[];
  color?: string;
  createdAt: string;
  participants: IUser[];
}

export interface ICreateProject {
  title: string;
  color: string;
}
