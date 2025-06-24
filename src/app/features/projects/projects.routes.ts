import {Routes} from "@angular/router";
import {Projects} from './projects';
import {ProjectDetails} from './components/project-details/project-details';


export const projectsRoutes: Routes = [
  {
    path: '',
    component: Projects,
    children: [
      {
        path: ':uuid',
        component: ProjectDetails
      }
    ]
  }
]
