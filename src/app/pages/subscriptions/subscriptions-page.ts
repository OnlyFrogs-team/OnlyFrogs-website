import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ONLYFROGS_DATA } from '../../data/onlyfrogs.data';
import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../../shared/frog-icon/frog-icon';

type BillingMode = 'monthly' | 'annual';

@Component({
  selector: 'app-subscriptions-page',
  imports: [FrogIcon, RouterLink],
  template: `
    @if (confirmed()) {
      <section class="page-section centered-state">
        <app-frog-icon [size]="100" [color]="activeTier()?.color ?? theme.accentColor()" />
        <p class="eyebrow">Welcome to the bog</p>
        <h1 [style.font-family]="theme.headingFont()">You are now a {{ activeTier()?.name }}.</h1>
        <p>Your first box will ship within 3–5 bog days. The frogs already know you're coming.</p>
        <div class="action-row">
          <button type="button" class="secondary-button" (click)="backToTiers()">← Back</button>
          <a class="primary-button" routerLink="/shop">Browse Talismans →</a>
        </div>
      </section>
    } @else {
      <section class="page-section pricing-page">
        <header class="page-header centered">
          <p class="eyebrow">Monthly Mystery</p>
          <h1 [style.font-family]="theme.headingFont()">Choose Your Tier</h1>
          <p>Monthly boxes of hand-crocheted talismans, delivered straight from the bog to your door.</p>

          <div class="segment-control" aria-label="Billing period">
            <button type="button" [class.active]="billing() === 'monthly'" (click)="billing.set('monthly')">Monthly</button>
            <button type="button" [class.active]="billing() === 'annual'" (click)="billing.set('annual')">Annual <span>Save 17%</span></button>
          </div>
        </header>

        <div class="pricing-grid">
          @for (tier of tiers; track tier.id) {
            <article class="pricing-card" [class.popular]="tier.popular" [style.--tier-color]="tier.color">
              @if (tier.popular) {
                <span class="popular-badge">🐸 Most Popular</span>
              }
              <app-frog-icon [size]="52" [color]="tier.color" />
              <h2 [style.font-family]="theme.headingFont()">{{ tier.name }}</h2>
              <p>{{ tier.tagline }}</p>
              <div class="price-line">
                <strong [style.font-family]="theme.headingFont()">{{ displayPrice(tier.price) }}</strong>
                <span>{{ billing() === 'annual' ? '/yr' : '/mo' }}</span>
              </div>
              @if (billing() === 'annual') {
                <p class="monthly-note">= {{ monthlyAnnualPrice(tier.price) }}/mo • 2 months free</p>
              }
              <ul>
                @for (perk of tier.perks; track perk) {
                  <li><span>✓</span>{{ perk }}</li>
                }
              </ul>
              <button type="button" (click)="selectTier(tier.id)">Start as {{ tier.name }} →</button>
            </article>
          }
        </div>

        <div class="faq-grid">
          @for (item of faqs; track item.question) {
            <article>
              <h2 [style.font-family]="theme.headingFont()">{{ item.question }}</h2>
              <p>{{ item.answer }}</p>
            </article>
          }
        </div>
      </section>
    }
  `,
})
export class SubscriptionsPage {
  readonly theme = inject(ThemeService);
  readonly tiers = ONLYFROGS_DATA.subscriptions;
  readonly billing = signal<BillingMode>('monthly');
  readonly selected = signal<string | null>(null);
  readonly confirmed = signal(false);
  readonly activeTier = computed(() => this.tiers.find((tier) => tier.id === this.selected()));
  readonly faqs = [
    { question: 'Can I cancel anytime?', answer: 'Yes. The frogs will be sad, but they understand. No lock-in.' },
    { question: 'What if I already own a frog?', answer: 'Every frog is unique. Duplicates are statistically improbable. Spiritually, however, welcome.' },
    { question: 'Are the talismans actually magic?', answer: 'We cannot legally confirm this. We can legally say: many customers report unexpected good fortune.' },
  ];

  price(price: number): string {
    return this.billing() === 'annual' ? (price * 0.83 * 12).toFixed(0) : price.toFixed(2);
  }

  displayPrice(price: number): string {
    return `$${this.price(price)}`;
  }

  monthlyAnnualPrice(price: number): string {
    return `$${(price * 0.83).toFixed(2)}`;
  }

  selectTier(id: string): void {
    this.selected.set(id);
    this.confirmed.set(true);
  }

  backToTiers(): void {
    this.confirmed.set(false);
    this.selected.set(null);
  }
}
