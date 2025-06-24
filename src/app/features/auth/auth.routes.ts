import {Routes} from "@angular/router";
import {Auth} from './auth';

export const authRoutes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login),
        data: {
          showHeader: false
        }
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register').then(m => m.Register),
        data: {
          showHeader: false
        }
      }
    ]
  }
]
