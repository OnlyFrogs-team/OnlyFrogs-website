import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';

import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../frog-icon/frog-icon';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe, FrogIcon],
  template: `
    @if (open()) {
      <button
        class="drawer-backdrop"
        type="button"
        aria-label="Close cart"
        (click)="closed.emit()"
      ></button>
      <aside class="cart-drawer" aria-label="Shopping cart">
        <header class="drawer-header">
          <h2 [style.font-family]="theme.headingFont()">Your Bag of Frogs</h2>
          <button type="button" class="icon-button" aria-label="Close cart" (click)="closed.emit()">
            ✕
          </button>
        </header>

        <div class="drawer-body">
          @if (cart.items().length === 0) {
            <div class="empty-state">
              <app-frog-icon [size]="60" color="#2e2e52" />
              <p>Your bag is empty.<br />The frogs are waiting.</p>
            </div>
          } @else {
            @for (item of cart.items(); track item.id) {
              <div class="cart-row">
                <div class="cart-thumb" [style.background]="item.color + '22'">
                  <app-frog-icon [size]="44" [color]="item.color" />
                </div>
                <div class="cart-copy">
                  <strong [style.font-family]="theme.headingFont()">{{ item.name }}</strong>
                  <span>{{ item.price | currency: 'USD' : 'symbol' : '1.2-2' }}</span>
                </div>
                <div class="qty-controls">
                  <button type="button" (click)="cart.decrement(item.id)">−</button>
                  <span>{{ item.qty }}</span>
                  <button type="button" (click)="cart.increment(item.id)">+</button>
                </div>
              </div>
            }
          }
        </div>

        <footer class="drawer-footer">
          <div class="drawer-total">
            <span>Total</span>
            <strong [style.font-family]="theme.headingFont()">{{
              cart.total() | currency: 'USD' : 'symbol' : '1.2-2'
            }}</strong>
          </div>
          <button type="button" class="primary-button full-width">Proceed to Checkout →</button>
          <p>All frogs are ritually inspected before shipping.</p>
        </footer>
      </aside>
    }
  `,
})
export class CartDrawer {
  readonly open = input(false);
  readonly closed = output<void>();
  readonly cart = inject(CartService);
  readonly theme = inject(ThemeService);
}
