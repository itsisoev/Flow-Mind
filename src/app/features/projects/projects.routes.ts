import {Routes} from "@angular/router";
import {Projects} from './projects';


export const projectsRoutes: Routes = [
  {
    path: '',
    component: Projects,
    children: []
  }
]
