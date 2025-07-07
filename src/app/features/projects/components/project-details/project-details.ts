import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {ProjectService} from '../../service/project';
import {ToastrService} from 'ngx-toastr';
import {takeUntilDestroyed, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {filter, map, tap} from 'rxjs';
import {IProject, ITask, TaskStatus} from '../../../../shared/models/project.model';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreateTask} from '../../../tasks/components/create-task/create-task';
import {DatePipe} from '@angular/common';
import {CdkDragDrop, DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {PRIORITY_COLORS} from '../../../../shared/constants/priority';
import {OptionsTask} from '../../../tasks/components/options-task/options-task';
import {SearchUser} from './components/search-user/search-user';

@Component({
  selector: 'features-project-details',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    CreateTask,
    DatePipe,
    FormsModule,
    DragDropModule,
    OptionsTask,
    SearchUser,
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetails {
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);


  readonly uuid = toSignal(this.route.paramMap.pipe(
    map(params => params.get('uuid') ?? '')
  ));

  readonly tasksByStatus = computed<Record<TaskStatus, ITask[]>>(() => {
    const p = this.project();
    if (!p) return {
      todo: [],
      'in-progress': [],
      done: []
    };
    return {
      todo: p.tasks.filter(t => t.status === 'todo'),
      'in-progress': p.tasks.filter(t => t.status === 'in-progress'),
      done: p.tasks.filter(t => t.status === 'done'),
    };
  });

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case 'todo':
        return 'К выполнению';
      case 'in-progress':
        return 'В процессе';
      case 'done':
        return 'Готово';
    }
  }

  project = signal<IProject | null>(null);
  openModalAdd = signal<boolean>(false);
  showDescTask = signal<boolean>(false);
  openedTaskUUID = signal<string | null>(null);
  statuses = signal<TaskStatus[]>(['todo', 'in-progress', 'done'])

  constructor() {
    toObservable(this.uuid).pipe(
      filter(Boolean),
      tap(uuid => {
        this.getUserProject(uuid)
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getUserProject(uuid: string): void {
    this.projectService.getUserProject(uuid).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.project.set(res)
      },
      error: (error) => {
      }
    })
  }

  isOpenModal() {
    this.openModalAdd.set(!this.openModalAdd());
  }

  toggleTaskDescription(uuid: string) {
    this.openedTaskUUID.set(
      this.openedTaskUUID() === uuid ? null : uuid
    );
  }

  toggleTaskDone(taskUUID: string, done: boolean) {
    this.projectService.updateTaskStatus(taskUUID, done)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          const currentProject = this.project();
          if (currentProject) {
            const updatedTasks = currentProject.tasks.map(task =>
              task.uuid === taskUUID ? {...task, done} : task
            );
            this.project.set({...currentProject, tasks: updatedTasks});
          }
        },
        error: () => {
          this.toastr.error('Ошибка при обновлении задачи');
        }
      });
  }

  filteredTasksByStatus(status: string) {
    return this.project()?.tasks.filter(task => task.status === status) ?? [];
  }

  onTaskDrop(event: CdkDragDrop<any[]>, newStatus: TaskStatus): void {
    const task = event.item.data;
    const currentProject = this.project();

    if (!currentProject || task.status === newStatus) return;

    // Обновление на сервере
    this.projectService.updateTaskStatus(task.uuid, task.done, newStatus).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        const updatedTasks = currentProject.tasks.map(t =>
          t.uuid === task.uuid ? {...t, status: newStatus} : t
        );
        this.project.set({...currentProject, tasks: updatedTasks});
      },
      error: () => {
        this.toastr.error('Ошибка при перемещении задачи');
        // Можно добавить откат визуальных изменений при ошибке
      }
    });

    // Визуальное перемещение
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getPriorityColor(priority: ITask['priority'] | undefined): string {
    return priority && priority in PRIORITY_COLORS
      ? PRIORITY_COLORS[priority]
      : '#ccc';
  }
}
