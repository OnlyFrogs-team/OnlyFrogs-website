import { Routes } from '@angular/router';

import { BlogPage } from './pages/blog/blog-page';
import { ConsultPage } from './pages/consult/consult-page';
import { ForumPage } from './pages/forum/forum-page';
import { HomePage } from './pages/home/home-page';
import { ShopPage } from './pages/shop/shop-page';
import { SubscriptionsPage } from './pages/subscriptions/subscriptions-page';
import { SuppliesPage } from './pages/supplies/supplies-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'shop', component: ShopPage },
  { path: 'subscriptions', component: SubscriptionsPage },
  { path: 'blog', component: BlogPage },
  { path: 'supplies', component: SuppliesPage },
  { path: 'forum', component: ForumPage },
  { path: 'consult', component: ConsultPage },
  { path: '**', redirectTo: '' },
];
