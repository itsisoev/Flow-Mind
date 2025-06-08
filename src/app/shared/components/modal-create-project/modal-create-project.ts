import {ChangeDetectionStrategy, Component, output} from '@angular/core';

@Component({
  selector: 'uc-modal-create-project',
  imports: [],
  templateUrl: './modal-create-project.html',
  styleUrl: './modal-create-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateProject {
  closeModal = output();

  onClose() {
    this.closeModal.emit()
  }
}
