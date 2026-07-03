import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ONLYFROGS_DATA } from '../../data/onlyfrogs.data';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../../shared/frog-icon/frog-icon';

@Component({
  selector: 'app-supplies-page',
  imports: [CurrencyPipe, FormsModule, FrogIcon],
  template: `
    <section class="page-section product-page narrow">
      <header class="page-header">
        <p class="eyebrow">The Bog Apothecary</p>
        <h1 [style.font-family]="theme.headingFont()">Crochet Supplies</h1>
        <p>
          Everything you need to make your own frogs. Subscribers get up to 20% off, automatically
          applied.
        </p>
      </header>

      <article class="feature-banner">
        <div>
          <p class="eyebrow">Best Value</p>
          <h2 [style.font-family]="theme.headingFont()">The OnlyFrogs Starter Kit</h2>
          <p>
            Everything to make your first talisman — yarn, hook, eyes, pattern, and one free worry.
          </p>
        </div>
        <div>
          <strong [style.font-family]="theme.headingFont()">$34.99</strong>
          <button type="button" class="primary-button" (click)="addStarterKit()">Add Kit →</button>
        </div>
      </article>

      <div class="toolbar left-toolbar">
        <input
          type="search"
          placeholder="Search supplies…"
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
        />
        <div class="chip-row" aria-label="Supply filters">
          @for (category of categories; track category) {
            <button
              type="button"
              class="chip"
              [class.active]="categoryFilter() === category"
              (click)="categoryFilter.set(category)"
            >
              {{ category }}
            </button>
          }
        </div>
      </div>

      <div class="supply-grid">
        @for (item of filteredSupplies(); track item.id) {
          <article class="supply-card lift-card">
            <header>
              <span
                class="tag"
                [style.color]="categoryColor(item.category)"
                [style.border-color]="categoryColor(item.category) + '55'"
                [style.background]="categoryColor(item.category) + '22'"
                >{{ item.category }}</span
              >
              @if (item.stock < 10) {
                <span class="low-stock">{{ item.stock }} left</span>
              }
            </header>
            <div class="supply-photo">supply photo</div>
            <h2 [style.font-family]="theme.headingFont()">{{ item.name }}</h2>
            <p>{{ item.desc }}</p>
            <footer class="card-footer">
              <strong [style.font-family]="theme.headingFont()">{{
                item.price | currency: 'USD' : 'symbol' : '1.2-2'
              }}</strong>
              <button type="button" class="soft-button" (click)="cart.addSupply(item)">
                {{ cart.hasItem('s-' + item.id) ? '+ More' : 'Add' }}
              </button>
            </footer>
          </article>
        }
      </div>

      @if (filteredSupplies().length === 0) {
        <div class="empty-state">
          <app-frog-icon [size]="60" color="#2e2e52" />
          <p>No supplies found. The bog is searching.</p>
        </div>
      }
    </section>
  `,
})
export class SuppliesPage {
  readonly theme = inject(ThemeService);
  readonly cart = inject(CartService);
  readonly categoryFilter = signal('All');
  readonly search = signal('');
  readonly categories = ['All', 'Yarn', 'Tools', 'Eyes & Notions', 'Patterns', 'Stuffing', 'Kits'];

  readonly filteredSupplies = computed(() => {
    const category = this.categoryFilter();
    const term = this.search().trim().toLowerCase();
    return ONLYFROGS_DATA.supplies.filter(
      (item) =>
        (category === 'All' || item.category === category) &&
        (term === '' || item.name.toLowerCase().includes(term)),
    );
  });

  addStarterKit(): void {
    const starter = ONLYFROGS_DATA.supplies.find((item) => item.name.includes('Starter Kit'));
    if (starter) {
      this.cart.addSupply(starter);
    }
  }

  categoryColor(category: string): string {
    const colors: Record<string, string> = {
      Yarn: '#5a8a4a',
      'Eyes & Notions': '#b87aff',
      Tools: '#c8956a',
      Patterns: '#7ecac3',
      Stuffing: '#8a6b4a',
      Kits: '#4a6b8a',
    };
    return colors[category] ?? this.theme.accentColor();
  }
}
