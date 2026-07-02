import { describe, expect, it } from 'vitest';

import { routes } from './app.routes';

describe('app routes', () => {
  it('exposes every migrated OnlyFrogs page as a real URL route', () => {
    const paths = routes.map((route) => route.path);

    expect(paths).toEqual(['', 'shop', 'subscriptions', 'blog', 'supplies', 'forum', 'consult', '**']);
  });
});
