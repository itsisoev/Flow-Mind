import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'features-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tasks {
}
