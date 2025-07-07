import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly baseAPI = environment.baseAPI;

  searchUsers(query: string){
    return this.http.get(`${this.baseAPI}users/search?q=${query}`);
  }
}
