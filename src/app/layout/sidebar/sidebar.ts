import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ThemeToggle} from '../theme-toggle/theme-toggle';

@Component({
  selector: 'layout-sidebar',
  imports: [
    ThemeToggle
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
