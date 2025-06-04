import {Routes} from "@angular/router";
import {Auth} from './auth';

export const authRoutes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.Login),
        data: {
          showHeader: false
        }
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register').then(m => m.Register),
        data: {
          showHeader: false
        }
      }
    ]
  }
]
