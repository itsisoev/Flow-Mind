import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {UserService} from '../../../../../users/service/user';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProjectService} from '../../../../service/project';

@Component({
  selector: 'features-search-user',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-user.html',
  styleUrl: './search-user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchUser implements OnInit {
  private readonly usersService = inject(UserService);
  private readonly projectsService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);

  projectUUID = input<string>();

  users = signal<any>([]);
  showModal = signal<boolean>(false);

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(450),
        distinctUntilChanged(),
        switchMap((query) => this.usersService.searchUsers(query ?? '')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((users) => {
        this.users.set(users);
      });
  }

  isShowModal() {
    this.showModal.set(!this.showModal());
  }

  toggleModal() {
    this.showModal.update((v) => !v);
  }

  addParticipant(participantUUID: string) {
    const projectUUID = this.projectUUID();
    if (!projectUUID) {
      return;
    }

    this.projectsService.addParticipant(projectUUID, participantUUID).subscribe({
      next: () => {
        this.toggleModal();
        this.searchControl.setValue('');
        this.users.set([]);
      },
      error: (err) => {
        console.error('Ошибка при добавлении участника', err);
      },
    });
  }
}
