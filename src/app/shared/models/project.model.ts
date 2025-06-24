export interface ITask {
  title: string;
  description: string;
  done: boolean;
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
