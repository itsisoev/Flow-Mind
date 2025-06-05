import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../core/services/auth';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {Loader} from '../../../shared/components/loader/loader';

@Component({
  selector: 'feature-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslatePipe,
    Loader
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../auth.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  authForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });
  isLoading = signal<boolean>(false);

  onSubmit() {
    this.isLoading.set(true);

    const {username, password} = this.authForm.value;
    const userData = {
      username: username ?? '',
      password: password ?? '',
    };


    this.authService.login(userData).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastr.success(res?.message || 'Регистрация успешна', 'Успех');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err.error.message, 'Ошибка');
      }
    });
  }
}
