import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {ICreateProject, IProject, ITask} from '../../../shared/models/project.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly baseAPI = environment.baseAPI + 'projects';

  createProject(project: ICreateProject): Observable<ICreateProject> {
    return this.http.post<ICreateProject>(this.baseAPI, project);
  }

  getUserProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(this.baseAPI);
  }

  getUserProject(uuid: string): Observable<IProject> {
    return this.http.get<IProject>(this.baseAPI + '/' + uuid);
  }

  addTaskToProject(projectUUID: string, task: ITask): Observable<ITask> {
    return this.http.post<ITask>(`${this.baseAPI}/${projectUUID}/task`, task);
  }

  getProjectTasks(projectUUID: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.baseAPI}/${projectUUID}/tasks`);
  }

  updateTaskStatus(taskUUID: string, done: boolean, status?: 'todo' | 'in-progress' | 'done') {
    return this.http.patch(`${this.baseAPI}/tasks/${taskUUID}`, {done, status});
  }

  deleteTask(taskUUID: string): Observable<void> {
    return this.http.delete<void>(`${this.baseAPI}/tasks/${taskUUID}`);
  }

  addParticipant(projectUUID: string, participantUUID: string): Observable<any> {
    return this.http.post(
      `${this.baseAPI}/${projectUUID}/participants/${participantUUID}`,
      {},
    );
  }

  transferTask(taskUUID: string, toUserUUID: string) {
    return this.http.post(`${this.baseAPI}/tasks/${taskUUID}/transfer/${toUserUUID}`, {});
  }

  getProjectUsers(projectUUID: string): Observable<{ uuid: string; name: string }[]> {
    return this.http.get<{ uuid: string; name: string }[]>(`${this.baseAPI}/${projectUUID}/users`);
  }
}
