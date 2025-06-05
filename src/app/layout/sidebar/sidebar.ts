import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ThemeToggle} from '../theme-toggle/theme-toggle';
import {Translation} from '../translation/translation';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'layout-sidebar',
  imports: [
    ThemeToggle,
    Translation,
    TranslatePipe
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  sidebarOpen = signal<boolean>(false);

  get isSidebarOpen(): boolean {
    return this.sidebarOpen();
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

}
