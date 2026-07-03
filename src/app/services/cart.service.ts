import { computed, Injectable, signal } from '@angular/core';

import { CartItem, Supply, Talisman } from '../data/onlyfrogs.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemState = signal<CartItem[]>([]);

  readonly items = this.itemState.asReadonly();
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.qty, 0));
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.qty, 0),
  );

  addTalisman(talisman: Talisman): void {
    this.upsert({
      id: `t-${talisman.id}`,
      name: talisman.name,
      price: talisman.price,
      qty: 1,
      color: talisman.color,
      kind: 'talisman',
    });
  }

  addSupply(supply: Supply): void {
    this.upsert({
      id: `s-${supply.id}`,
      name: supply.name,
      price: supply.price,
      qty: 1,
      color: '#4a6b4a',
      kind: 'supply',
    });
  }

  increment(id: string): void {
    this.itemState.update((items) =>
      items.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  }

  decrement(id: string): void {
    this.itemState.update((items) =>
      items
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );
  }

  hasItem(id: string): boolean {
    return this.items().some((item) => item.id === id);
  }

  private upsert(next: CartItem): void {
    this.itemState.update((items) => {
      const existing = items.find((item) => item.id === next.id);
      if (!existing) {
        return [...items, next];
      }

      return items.map((item) => (item.id === next.id ? { ...item, qty: item.qty + 1 } : item));
    });
  }
}
