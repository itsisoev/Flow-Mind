import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {ProjectService} from '../../../projects/service/project';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastrService} from 'ngx-toastr';
import {Loader} from '../../../../shared/components/loader/loader';

@Component({
  selector: 'features-options-task',
  imports: [
    TranslatePipe,
    Loader
  ],
  templateUrl: './options-task.html',
  styleUrl: './options-task.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsTask {
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  taskUUID = input<string>();
  participants = input<any[]>();

  showOptions = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  showParticipants = signal<boolean>(false);

  isShowOptions() {
    this.showOptions.set(!this.showOptions());
  }

  toggleParticipants() {
    this.showParticipants.set(!this.showParticipants());
  }

  deleteTask() {
    this.isLoading.set(true);

    const uuid = this.taskUUID();
    if (!uuid) {
      this.toastr.error('UUID задачи не определён');
      return;
    }

    this.projectService.deleteTask(uuid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastr.success('Задача успешно удалена');
          this.showOptions.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error(`Ошибка при удалений задачи: ${error}`);
          this.showOptions.set(false);
        },
      });
  }

  transferTask(userUUID: string) {
    const taskUuid = this.taskUUID();
    if (!taskUuid) {
      this.toastr.error('UUID задачи не определён');
      return;
    }

    this.isLoading.set(true);
    this.projectService.transferTask(taskUuid, userUUID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastr.success('Задача успешно передана');
          this.showOptions.set(false);
          this.showParticipants.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error(`Ошибка при передаче задачи: ${error?.error?.message || error}`);
        },
      });
  }
}
