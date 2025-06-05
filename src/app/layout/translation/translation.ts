import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'layout-translation',
  imports: [
    TranslatePipe
  ],
  templateUrl: './translation.html',
  styleUrl: './translation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Translation {
  public translate = inject(TranslateService);
  public currentLang = this.translate.currentLang || 'en';

  constructor() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);
    this.currentLang = savedLang;

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  toggleLang() {
    const current = this.translate.currentLang;
    const next = current === 'en' ? 'ru' : 'en';
    this.translate.use(next);
    localStorage.setItem('lang', next);
  }
}
