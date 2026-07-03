import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ONLYFROGS_DATA } from '../../data/onlyfrogs.data';
import { Talisman } from '../../data/onlyfrogs.models';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { CartDrawer } from '../../shared/cart-drawer/cart-drawer';
import { FrogIcon } from '../../shared/frog-icon/frog-icon';

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'rating';

@Component({
  selector: 'app-shop-page',
  imports: [CartDrawer, CurrencyPipe, FormsModule, FrogIcon],
  template: `
    <section class="page-section product-page">
      <app-cart-drawer [open]="cartOpen()" (closed)="cartOpen.set(false)" />

      <header class="page-header">
        <p class="eyebrow">The Collection</p>
        <h1 [style.font-family]="theme.headingFont()">Talisman Shop</h1>
        <p>
          Each frog is hand-crocheted and imbued with ambiguous magical intent. No refunds on
          prophecies.
        </p>
      </header>

      <div class="toolbar">
        <div class="chip-row" aria-label="Talisman filters">
          @for (tag of allTags; track tag) {
            <button
              type="button"
              class="chip"
              [class.active]="filter() === tag"
              (click)="filter.set(tag)"
            >
              {{ tag }}
            </button>
          }
        </div>
        <select [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div class="product-grid">
        @for (talisman of filteredTalismans(); track talisman.id) {
          <article class="product-card lift-card">
            <div
              class="product-visual"
              [style.background]="
                'radial-gradient(circle at 40% 40%, ' +
                talisman.color +
                '44, ' +
                talisman.color +
                '11)'
              "
            >
              <app-frog-icon [size]="72" [color]="talisman.color" />
              @if (talisman.stock <= 2) {
                <span class="stock-badge">ONLY {{ talisman.stock }} LEFT</span>
              }
            </div>
            <div class="tag-row">
              @for (tag of talisman.tags; track tag) {
                <span
                  class="tag"
                  [style.color]="tagColor(tag)"
                  [style.border-color]="tagColor(tag) + '55'"
                  [style.background]="tagColor(tag) + '22'"
                  >{{ tag }}</span
                >
              }
            </div>
            <h2 [style.font-family]="theme.headingFont()">{{ talisman.name }}</h2>
            <p class="rating">
              <span>{{ stars(talisman.rating) }}</span> {{ talisman.rating }} ({{
                talisman.reviews
              }})
            </p>
            <p>{{ talisman.desc }}</p>
            <footer class="card-footer">
              <strong [style.font-family]="theme.headingFont()">{{
                talisman.price | currency: 'USD' : 'symbol' : '1.2-2'
              }}</strong>
              <button type="button" class="soft-button" (click)="cart.addTalisman(talisman)">
                {{ cart.hasItem(talismanId(talisman)) ? 'Add Another' : 'Add to Cart' }}
              </button>
            </footer>
          </article>
        }
      </div>

      @if (cart.count() > 0) {
        <button type="button" class="floating-cart" (click)="cartOpen.set(true)">
          🛒 {{ cart.count() }} frogs — View Bag
        </button>
      }
    </section>
  `,
})
export class ShopPage {
  readonly theme = inject(ThemeService);
  readonly cart = inject(CartService);
  readonly cartOpen = signal(false);
  readonly filter = signal('All');
  readonly sortBy = signal<SortMode>('featured');
  readonly allTags = [
    'All',
    'Luck',
    'Wisdom',
    'Protection',
    'Mystery',
    'Prophecy',
    'Rare',
    'Love',
    'Peace',
  ];

  readonly filteredTalismans = computed(() => {
    const filter = this.filter();
    const sortBy = this.sortBy();
    return [...ONLYFROGS_DATA.talismans]
      .filter((talisman) => filter === 'All' || talisman.tags.includes(filter))
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  });

  talismanId(talisman: Talisman): string {
    return `t-${talisman.id}`;
  }

  stars(rating: number): string {
    const full = Math.floor(rating);
    return `${'★'.repeat(full)}${'☆'.repeat(5 - full)}`;
  }

  tagColor(tag: string): string {
    const colors: Record<string, string> = {
      Rare: '#b87aff',
      'Void-touched': '#7ecac3',
      Powerful: '#c8956a',
      Luck: '#5a8a4a',
      Wealth: '#c8956a',
      Wisdom: '#4a8a8a',
      Protection: '#6b3f8a',
      Mystery: '#6b3f8a',
      Prophecy: '#4a6b8a',
      Weather: '#4a6b8a',
      Everyday: '#6b6b4a',
      Love: '#8a3f6b',
      Harmony: '#6b8a4a',
      Sleep: '#4a4a8a',
      Peace: '#4a6b8a',
    };
    return colors[tag] ?? '#3f3f6b';
  }
}
