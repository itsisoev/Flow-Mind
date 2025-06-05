import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

const STORAGE_KEY = 'dark-mode';

@Component({
  selector: 'layout-theme-toggle',
  imports: [
    TranslatePipe
  ],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggle {
  private isDark = signal<boolean>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.isDark());
  }

  isDarkMode = this.isDark.asReadonly();

  toggleTheme(): void {
    const newValue = !this.isDark();
    this.isDark.set(newValue);
    this.applyTheme(newValue);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
  }

  private getStoredTheme(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle('dark-theme', isDark);
  }
}
