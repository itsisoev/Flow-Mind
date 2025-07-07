import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ProjectService} from '../../../projects/service/project';

@Component({
  selector: 'features-task-modal',
  imports: [],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskModal {
  private readonly projectService = inject(ProjectService);

  showModal = signal<boolean>(false);

  isShowModal() {
    this.showModal.set(!this.showModal());
  }
}
