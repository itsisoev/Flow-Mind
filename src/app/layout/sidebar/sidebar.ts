import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ThemeToggle} from '../theme-toggle/theme-toggle';
import {Translation} from '../translation/translation';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalCreateProject} from '../../shared/components/modal-create-project/modal-create-project';

export interface HeaderLink {
  label: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'layout-sidebar',
  imports: [
    ThemeToggle,
    Translation,
    TranslatePipe,
    RouterLink,
    ModalCreateProject,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  private readonly sanitizer = inject(DomSanitizer)

  links = signal<HeaderLink[]>([
    {
      label: 'TODAY',
      href: '/today',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6zm1 3h10a.5.5 0 1 1 0 1H7a.5.5 0 0 1 0-1z"></path><text font-family="-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" font-size="9" transform="translate(4 2)" font-weight="500"><tspan x="8" y="15" text-anchor="middle">05</tspan></text></g></svg>`
    },
    {
      label: 'UPCOMING',
      href: '/upcoming',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm10 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m9-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z" clip-rule="evenodd"></path></svg>`
    },
    {
      label: 'FILTERS_LABELS',
      href: '/filters-labels',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M13 6.501a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5zm-6.5 6.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5zm8 0a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5zm-8-8a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5z" clip-rule="evenodd"></path></svg>`
    }
  ]);

  sidebarOpen = signal<boolean>(false);
  openModal = signal<boolean>(false);

  get isSidebarOpen(): boolean {
    return this.sidebarOpen();
  }

  getSafeIcon(icon: string) {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  openCreateModal() {
    this.openModal.set(!this.openModal());
  }
}
