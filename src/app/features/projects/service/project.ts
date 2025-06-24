import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {ICreateProject, IProject} from '../../../shared/models/project.model';
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
}
