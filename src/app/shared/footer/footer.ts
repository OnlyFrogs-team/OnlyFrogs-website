import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../frog-icon/frog-icon';

@Component({
  selector: 'app-footer',
  imports: [FrogIcon, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <app-frog-icon [size]="40" color="#2e2e52" />
        <p class="footer-title" [style.font-family]="theme.headingFont()">
          OnlyFrogs™ — Est. sometime during a full moon
        </p>
        <nav class="footer-links" aria-label="Footer navigation">
          <a routerLink="/shop">shop</a>
          <a routerLink="/subscriptions">subscriptions</a>
          <a routerLink="/blog">blog</a>
          <a routerLink="/supplies">supplies</a>
          <a routerLink="/forum">forum</a>
        </nav>
        <p class="footer-note">
          No frogs were harmed. All talismans are crocheted with love and mild obsession.
          Mystical claims not verified by the FDA, USDA, or the Bog Council.
        </p>
      </div>
    </footer>
  `,
})
export class Footer {
  readonly theme = inject(ThemeService);
}
