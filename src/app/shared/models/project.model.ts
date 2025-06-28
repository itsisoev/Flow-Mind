export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface ITask {
  uuid?: string;
  title: string;
  description?: string;
  done?: boolean;
  priority?: TaskPriority;
  term?: Date;
  status?: TaskStatus;
}

export interface IProject {
  uuid: string;
  title: string;
  tasks: ITask[];
  color?: string;
  createdAt: string;
}

export interface ICreateProject {
  title: string;
  color: string;
}
