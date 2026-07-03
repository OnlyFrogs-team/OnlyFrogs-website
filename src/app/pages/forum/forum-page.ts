import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DEFAULT_FORUM_REPLIES, ONLYFROGS_DATA } from '../../data/onlyfrogs.data';
import { ForumPost, ForumReply } from '../../data/onlyfrogs.models';
import { ThemeService } from '../../services/theme.service';

const TAG_COLORS: Record<string, string> = {
  Help: '#c8956a',
  Haul: '#5a8a4a',
  Testimonial: '#b87aff',
  Supplies: '#7ecac3',
  Challenge: '#4a6b8a',
  'Off-Topic': '#6b4a4a',
  Shipping: '#4a4a6b',
};

@Component({
  selector: 'app-forum-page',
  imports: [FormsModule],
  template: `
    <section class="page-section forum-page">
      <header class="forum-heading">
        <div>
          <p class="eyebrow">The Bog</p>
          <h1 [style.font-family]="theme.headingFont()">Community Forum</h1>
          <p>Argue about yarn. Share your frogs. Ask for help. We're all here.</p>
        </div>
        <button type="button" class="soft-button" (click)="showNew.set(!showNew())">
          + New Thread
        </button>
      </header>

      @if (showNew()) {
        <form class="new-thread" (ngSubmit)="submitThread()">
          <h2 [style.font-family]="theme.headingFont()">Start a Thread</h2>
          <input
            name="newTitle"
            [ngModel]="newTitle()"
            (ngModelChange)="newTitle.set($event)"
            placeholder="What's on your mind? (frog-related, ideally)"
          />
          <div class="chip-row">
            @for (tag of tagsWithoutAll; track tag) {
              <button
                type="button"
                class="chip"
                [class.active]="newTag() === tag"
                (click)="newTag.set(tag)"
              >
                {{ tag }}
              </button>
            }
          </div>
          <div class="action-row compact">
            <button type="button" class="secondary-button" (click)="showNew.set(false)">
              Cancel
            </button>
            <button type="submit" class="primary-button">Post Thread</button>
          </div>
        </form>
      }

      <dl class="forum-stats">
        <div>
          <dt [style.font-family]="theme.headingFont()">1,240</dt>
          <dd>Members</dd>
        </div>
        <div>
          <dt [style.font-family]="theme.headingFont()">8,900+</dt>
          <dd>Posts</dd>
        </div>
        <div>
          <dt [style.font-family]="theme.headingFont()">47</dt>
          <dd>Active Today</dd>
        </div>
      </dl>

      <div class="chip-row">
        @for (tag of tags; track tag) {
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

      <div class="forum-list">
        @for (post of filteredPosts(); track post.id) {
          <article class="forum-row" (click)="openThread(post)">
            <div class="avatar">{{ post.avatar }}</div>
            <div>
              <div class="tag-row">
                <span
                  class="tag"
                  [style.color]="tagColor(post.tag)"
                  [style.border-color]="tagColor(post.tag) + '55'"
                  [style.background]="tagColor(post.tag) + '22'"
                  >{{ post.tag }}</span
                >
                @if (post.hot) {
                  <span class="hot">🔥 Hot</span>
                }
              </div>
              <h2>{{ post.title }}</h2>
              <span>by {{ post.user }} · {{ post.time }}</span>
            </div>
            <div class="forum-meta">
              <div>
                <strong>{{ post.replies }}</strong
                ><span>replies</span>
              </div>
              <button
                type="button"
                (click)="toggleLike(post, $event)"
                [class.liked]="likedIds().has(post.id)"
              >
                <span>{{ likedIds().has(post.id) ? '♥' : '♡' }}</span>
                {{ likeCount(post) }}
              </button>
            </div>
          </article>
        }
      </div>

      @if (openPost(); as post) {
        <div class="modal-host">
          <button
            class="modal-backdrop"
            type="button"
            aria-label="Close thread"
            (click)="openPost.set(null)"
          ></button>
          <article class="modal-panel thread-modal">
            <header>
              <div>
                <span
                  class="tag"
                  [style.color]="tagColor(post.tag)"
                  [style.border-color]="tagColor(post.tag) + '55'"
                  [style.background]="tagColor(post.tag) + '22'"
                  >{{ post.tag }}</span
                >
                <h2 [style.font-family]="theme.headingFont()">{{ post.title }}</h2>
                <p>by {{ post.user }} · {{ post.time }} · {{ post.replies }} replies</p>
              </div>
              <button type="button" class="icon-button" (click)="openPost.set(null)">✕</button>
            </header>

            <div class="reply-list">
              @for (reply of replies(); track reply.user + reply.time + $index) {
                <div class="reply-row">
                  <div class="avatar small">{{ reply.avatar }}</div>
                  <div>
                    <strong>{{ reply.user }}</strong>
                    <span>{{ reply.time }}</span>
                    <p>{{ reply.text }}</p>
                  </div>
                </div>
              }
            </div>

            <form class="reply-form" (ngSubmit)="submitReply()">
              <textarea
                name="reply"
                rows="3"
                [ngModel]="replyText()"
                (ngModelChange)="replyText.set($event)"
                placeholder="Share your frog wisdom…"
              ></textarea>
              <button type="submit" class="primary-button" [disabled]="!replyText().trim()">
                {{ submitted() ? '✓ Posted!' : 'Post Reply' }}
              </button>
            </form>
          </article>
        </div>
      }
    </section>
  `,
})
export class ForumPage {
  readonly theme = inject(ThemeService);
  readonly tags = [
    'All',
    'Help',
    'Haul',
    'Testimonial',
    'Supplies',
    'Challenge',
    'Off-Topic',
    'Shipping',
  ];
  readonly tagsWithoutAll = this.tags.filter((tag) => tag !== 'All');
  readonly filter = signal('All');
  readonly posts = signal<ForumPost[]>(ONLYFROGS_DATA.forumPosts);
  readonly showNew = signal(false);
  readonly newTitle = signal('');
  readonly newTag = signal('Help');
  readonly openPost = signal<ForumPost | null>(null);
  readonly replies = signal<ForumReply[]>(DEFAULT_FORUM_REPLIES);
  readonly replyText = signal('');
  readonly submitted = signal(false);
  readonly likedIds = signal(new Set<number>());
  readonly filteredPosts = computed(() => {
    const filter = this.filter();
    return this.posts().filter((post) => filter === 'All' || post.tag === filter);
  });

  tagColor(tag: string): string {
    return TAG_COLORS[tag] ?? '#7ecac3';
  }

  likeCount(post: ForumPost): number {
    return post.likes + (this.likedIds().has(post.id) ? 1 : 0);
  }

  toggleLike(post: ForumPost, event: Event): void {
    event.stopPropagation();
    this.likedIds.update((current) => {
      const next = new Set(current);
      if (next.has(post.id)) {
        next.delete(post.id);
      } else {
        next.add(post.id);
      }
      return next;
    });
  }

  openThread(post: ForumPost): void {
    this.openPost.set(post);
    this.replies.set(DEFAULT_FORUM_REPLIES);
    this.replyText.set('');
    this.submitted.set(false);
  }

  submitThread(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    this.posts.update((posts) => [
      {
        id: Date.now(),
        user: 'You',
        avatar: '🐸',
        title,
        replies: 0,
        likes: 0,
        tag: this.newTag(),
        time: 'just now',
        hot: false,
      },
      ...posts,
    ]);
    this.newTitle.set('');
    this.showNew.set(false);
  }

  submitReply(): void {
    const text = this.replyText().trim();
    if (!text) return;
    this.replies.update((replies) => [
      ...replies,
      { user: 'You', avatar: '🐸', time: 'just now', text },
    ]);
    this.replyText.set('');
    this.submitted.set(true);
  }
}
