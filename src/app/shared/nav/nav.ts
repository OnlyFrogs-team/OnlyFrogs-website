import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../frog-icon/frog-icon';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-nav',
  imports: [FrogIcon, RouterLink, RouterLinkActive],
  template: `
    <nav class="site-nav">
      <a class="brand" routerLink="/" aria-label="OnlyFrogs home">
        <app-frog-icon [size]="36" [color]="theme.accentColor()" />
        <span [style.font-family]="theme.headingFont()">OnlyFrogs</span>
      </a>

      <div class="nav-links" aria-label="Primary navigation">
        @for (item of navItems; track item.path) {
          <a
            class="nav-link"
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.path === '/' }"
          >
            {{ item.label }}
          </a>
        }
        <a class="cart-link" routerLink="/shop" aria-label="Open talisman shop cart">
          🛒
          @if (cart.count() > 0) {
            <span class="cart-count">{{ cart.count() }}</span>
          }
        </a>
      </div>
    </nav>
  `,
})
export class Nav {
  readonly cart = inject(CartService);
  readonly theme = inject(ThemeService);
  readonly navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Talismans' },
    { path: '/subscriptions', label: 'Subscribe' },
    { path: '/blog', label: 'Tutorials' },
    { path: '/supplies', label: 'Supplies' },
    { path: '/forum', label: 'Community' },
    { path: '/consult', label: '🐸 Consult' },
  ];
}
