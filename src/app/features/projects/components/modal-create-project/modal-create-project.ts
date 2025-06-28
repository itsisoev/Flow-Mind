import {ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal} from '@angular/core';
import {ProjectService} from '../../service/project';
import {ToastrService} from 'ngx-toastr';
import {ICreateProject} from '../../../../shared/models/project.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {Loader} from '../../../../shared/components/loader/loader';

@Component({
  selector: 'features-modal-create-project',
  imports: [
    FormsModule,
    TranslatePipe,
    Loader
  ],
  templateUrl: './modal-create-project.html',
  styleUrl: './modal-create-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateProject {
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  projectCreated = output<ICreateProject>();
  closeModal = output();

  projectName = signal<string>('');
  selectedColor = signal<string>('#ff9a14');
  colors = signal<string[]>([
    '#ff9a14', '#e2725b', '#e2729e',
    '#a26ee5', '#7b9ae4', '#6bc5d2',
    '#6bc58e', '#93c47d'
  ]);
  isLoading = signal<boolean>(false);

  onClose() {
    this.closeModal.emit()
  }

  createProject() {
    this.isLoading.set(true);
    const trimmedName = this.projectName().trim();

    if (!trimmedName) {
      this.toastr.warning('Введите имя проекта');
      return;
    }

    const newProject: ICreateProject = {
      title: trimmedName,
      color: this.selectedColor(),
    };

    this.projectService
      .createProject(newProject)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toastr.success('Проект создан');
          this.projectName.set('');
          this.selectedColor.set('#ff9a14');
          this.closeModal.emit();
          this.projectCreated.emit(res);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Ошибка при создании проекта');
        },
      });
  }
}
