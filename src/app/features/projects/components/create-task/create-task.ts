import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, model} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ITask} from '../../../../shared/models/project.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastrService} from 'ngx-toastr';
import {ProjectService} from '../../service/project';


@Component({
  selector: 'features-create-task',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTask {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly projectService = inject(ProjectService);

  uuid = input<string | null>(null);
  isOpenModal = model<boolean>(false);

  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium'],
    term: [''],
  });

  submitTask(): void {
    if (this.taskForm.invalid) {
      this.toastr.warning('Заполни хотя бы заголовок задачи');
      return;
    }

    const task: ITask = this.taskForm.value;
    this.addTask(task);
    this.taskForm.reset({
      priority: 'medium'
    });
  }

  addTask(task: ITask): void {
    const projectUUID = this.uuid();
    if (!projectUUID) return;

    this.projectService.addTaskToProject(projectUUID, task).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (newTask) => {
        this.toastr.success('Задача добавлена!');
        this.isOpenModal();
      },
      error: () => {
        this.toastr.error('Ошибка при добавлении задачи');
      }
    });
  }

  closeModal(): void {
    this.isOpenModal.set(false);
  }
}
