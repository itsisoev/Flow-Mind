import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'feature-auth',
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: 'auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Auth {
}
