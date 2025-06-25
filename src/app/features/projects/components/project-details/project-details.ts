import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {ProjectService} from '../../service/project';
import {ToastrService} from 'ngx-toastr';
import {takeUntilDestroyed, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {filter, map, tap} from 'rxjs';
import {IProject} from '../../../../shared/models/project.model';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'features-project-details',
  imports: [
    TranslatePipe
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

  project = signal<IProject | null>(null);
  openModalAdd = signal<boolean>(false);

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
}
