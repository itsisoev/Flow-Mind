import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ProjectService} from '../../service/project';
import {ToastrService} from 'ngx-toastr';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs';
import {IProject} from '../../../../shared/models/project.model';

@Component({
  selector: 'features-project-details',
  imports: [],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetails implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);

  readonly uuid = toSignal(this.route.paramMap.pipe(
    map(params => params.get('uuid') ?? '')
  ));

  project = signal<IProject | null>(null);


  ngOnInit(): void {
    this.getUserProject();
  }

  getUserProject() {
    const uuid = this.uuid();
    if (!uuid) {
      this.toastr.error('UUID не найден в URL');
      return;
    }

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
}
