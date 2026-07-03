import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vite-plus/test';

import { ONLYFROGS_DATA } from '../data/onlyfrogs.data';
import { CartService } from './cart.service';

describe('CartService', () => {
  it('adds talismans, increments existing quantities, and tracks the total count', () => {
    const service = TestBed.inject(CartService);
    const talisman = ONLYFROGS_DATA.talismans[0];

    service.addTalisman(talisman);
    service.addTalisman(talisman);

    expect(service.items()).toEqual([
      expect.objectContaining({ id: 't-1', name: 'The Croaker of Fortune', qty: 2 }),
    ]);
    expect(service.count()).toBe(2);
  });

  it('adds supplies with a distinct id prefix and removes items when decremented to zero', () => {
    const service = TestBed.inject(CartService);
    const supply = ONLYFROGS_DATA.supplies[0];

    service.addSupply(supply);
    service.decrement('s-1');

    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
  });
});
