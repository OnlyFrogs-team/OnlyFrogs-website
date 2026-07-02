import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../../shared/frog-icon/frog-icon';

@Component({
  selector: 'app-home-page',
  imports: [FrogIcon, RouterLink],
  template: `
    <section class="hero-section page-section">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right" [style.background]="'radial-gradient(circle, ' + theme.accentColor() + '26 0%, transparent 70%)'"></div>

      @for (frog of floatingFrogs; track frog.x + frog.y) {
        <div class="floating-frog" [style.left]="frog.x" [style.top]="frog.y" [style.animation-delay]="frog.delay">
          <app-frog-icon [size]="frog.size" [color]="frog.color" />
          <span>Frog</span>
        </div>
      }

      <div class="hero-content">
        <app-frog-icon [size]="110" [color]="theme.accentColor()" />
        <p class="eyebrow">Handcrafted • Mystical • Slightly Unhinged</p>
        <h1 [style.font-family]="theme.headingFont()">
          Your frog talisman<br>
          <em>awaits in the bog.</em>
        </h1>
        <p class="hero-copy">
          Hand-crocheted frog talismans of dubious magical provenance. Subscribe monthly,
          browse our shop, learn the craft, and argue about yarn in the forum.
        </p>
        <div class="action-row">
          <a class="primary-button" routerLink="/shop">Browse Talismans →</a>
          <a class="secondary-button" routerLink="/subscriptions">View Subscriptions</a>
        </div>

        <dl class="hero-stats">
          @for (stat of stats; track stat.value) {
            <div>
              <dt [style.font-family]="theme.headingFont()">{{ stat.value }}</dt>
              <dd>{{ stat.label }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
})
export class HomePage {
  readonly theme = inject(ThemeService);
  readonly stats = [
    { value: '4,200+', label: 'Talismans in the wild' },
    { value: '98%', label: 'Bog-certified authentic' },
    { value: '3', label: 'Subscription tiers' },
    { value: '∞', label: 'Frog lore available' },
  ];
  readonly floatingFrogs = [
    { x: '8%', y: '20%', size: 55, color: '#5a8a4a', delay: '0s' },
    { x: '88%', y: '15%', size: 48, color: '#4a6b6b', delay: '0.4s' },
    { x: '5%', y: '65%', size: 40, color: '#6b3f6b', delay: '0.8s' },
    { x: '90%', y: '60%', size: 52, color: '#6b5a3f', delay: '1.2s' },
    { x: '15%', y: '85%', size: 36, color: '#3f4a6b', delay: '1.6s' },
    { x: '82%', y: '80%', size: 44, color: '#5a4a6b', delay: '2s' },
  ];
}
