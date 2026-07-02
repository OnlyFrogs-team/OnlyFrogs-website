import { Component, computed, inject, signal } from '@angular/core';

import { ONLYFROGS_DATA } from '../../data/onlyfrogs.data';
import { BlogPost } from '../../data/onlyfrogs.models';
import { ThemeService } from '../../services/theme.service';
import { FrogIcon } from '../../shared/frog-icon/frog-icon';

@Component({
  selector: 'app-blog-page',
  imports: [FrogIcon],
  template: `
    <section class="page-section content-page">
      <header class="page-header">
        <p class="eyebrow">The Craft</p>
        <h1 [style.font-family]="theme.headingFont()">Tutorials & Lore</h1>
        <p>Learn to make your own talismans. Written by the community, for the community, about frogs.</p>
      </header>

      <article class="featured-post lift-card" (click)="openPost.set(posts[0])" tabindex="0" role="button">
        <div class="thumbnail large">
          <app-frog-icon [size]="64" color="#3a3a6a" />
          <span>featured tutorial thumbnail</span>
        </div>
        <div>
          <div class="tag-row">
            <span class="tag featured">Featured</span>
            <span class="tag" [style.color]="levelColor(posts[0].level)" [style.border-color]="levelColor(posts[0].level) + '55'" [style.background]="levelColor(posts[0].level) + '22'">{{ posts[0].level }}</span>
          </div>
          <h2 [style.font-family]="theme.headingFont()">{{ posts[0].title }}</h2>
          <p>{{ posts[0].excerpt }}</p>
          <span class="read-link">Read tutorial →</span>
        </div>
      </article>

      <div class="chip-row">
        @for (level of levels; track level) {
          <button type="button" class="chip" [class.active]="filter() === level" (click)="filter.set(level)">{{ level }}</button>
        }
      </div>

      <div class="post-grid">
        @for (post of filteredPosts(); track post.id) {
          <article class="post-card lift-card" (click)="openPost.set(post)" tabindex="0" role="button">
            <div class="thumbnail">
              <app-frog-icon [size]="48" color="#2e2e52" />
              <span>tutorial thumbnail</span>
            </div>
            <div class="tag-row">
              <span class="tag" [style.color]="levelColor(post.level)" [style.border-color]="levelColor(post.level) + '55'" [style.background]="levelColor(post.level) + '22'">{{ post.level }}</span>
              <span>{{ post.mins }} min read</span>
            </div>
            <h2 [style.font-family]="theme.headingFont()">{{ post.title }}</h2>
            <p>{{ post.excerpt }}</p>
            <footer>
              <span>by {{ post.author }} · {{ post.date }}</span>
              <span>Read →</span>
            </footer>
          </article>
        }
      </div>

      @if (openPost(); as post) {
        <div class="modal-host">
          <button class="modal-backdrop" type="button" aria-label="Close tutorial" (click)="openPost.set(null)"></button>
          <article class="modal-panel article-modal">
            <button class="icon-button modal-close" type="button" (click)="openPost.set(null)">✕</button>
            <div class="tag-row">
              <span class="tag" [style.color]="levelColor(post.level)" [style.border-color]="levelColor(post.level) + '55'" [style.background]="levelColor(post.level) + '22'">{{ post.level }}</span>
              <span>{{ post.mins }} min read · by {{ post.author }} · {{ post.date }}</span>
            </div>
            <h2 [style.font-family]="theme.headingFont()">{{ post.title }}</h2>
            <p>Welcome to this {{ post.level.toLowerCase() }}-level tutorial on "{{ post.title }}".</p>
            <h3 [style.font-family]="theme.headingFont()">What you'll need:</h3>
            <ul>
              <li>Size D or G crochet hook</li>
              <li>Yarn in your preferred bog-adjacent color</li>
              <li>Safety eyes (6mm or 9mm)</li>
              <li>Polyfill stuffing</li>
              <li>Tapestry needle + scissors</li>
            </ul>
            <p>This tutorial covers the full process from magic ring to finishing. If your frog comes out looking slightly evil, that's normal — it's a feature, not a bug.</p>
            <h3 [style.font-family]="theme.headingFont()">Step 1: The Magic Ring</h3>
            <p>Make an adjustable loop with your yarn, leaving a 6-inch tail. Insert hook, pull up a loop, chain 1. This is your starting ring. Do not question it.</p>
            <h3 [style.font-family]="theme.headingFont()">Step 2: Round 1</h3>
            <p>Work 6 single crochets into the ring. Pull the tail to close. You now have a tiny disc. The frog begins.</p>
            <h3 [style.font-family]="theme.headingFont()">Step 3: Increasing</h3>
            <p>Round 2: 2 sc in each st around. Round 3: sc, 2sc in next st around. Continue until desired circumference is achieved.</p>
          </article>
        </div>
      }
    </section>
  `,
})
export class BlogPage {
  readonly theme = inject(ThemeService);
  readonly posts = ONLYFROGS_DATA.blogPosts;
  readonly levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  readonly filter = signal('All');
  readonly openPost = signal<BlogPost | null>(null);
  readonly filteredPosts = computed(() => {
    const filter = this.filter();
    return this.posts.filter((post) => filter === 'All' || post.level === filter);
  });

  levelColor(level: string): string {
    const colors: Record<string, string> = {
      Beginner: '#5a8a4a',
      Intermediate: '#c8956a',
      Advanced: '#b87aff',
    };
    return colors[level] ?? '#7ecac3';
  }
}
