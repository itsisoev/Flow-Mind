import {ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal} from '@angular/core';
import {ProjectService} from '../../service/project';
import {ToastrService} from 'ngx-toastr';
import {ICreateProject} from '../../../../shared/models/project.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'features-modal-create-project',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './modal-create-project.html',
  styleUrl: './modal-create-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateProject {
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  projectName = signal<string>('');
  selectedColor = signal<string>('#ff9a14');
  colors = signal<string[]>([
    '#ff9a14', '#e2725b', '#e2729e',
    '#a26ee5', '#7b9ae4', '#6bc5d2',
    '#6bc58e', '#93c47d'
  ]);
  closeModal = output();

  onClose() {
    this.closeModal.emit()
  }

  createProject() {
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
        },
        error: (err) => {
          this.toastr.error('Ошибка при создании проекта');
          console.error(err);
        },
      });
  }
}
