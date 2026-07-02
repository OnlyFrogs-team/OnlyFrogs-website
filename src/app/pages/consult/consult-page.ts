import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FROG_PERSONALITIES } from '../../data/onlyfrogs.data';
import { FrogPersonality } from '../../data/onlyfrogs.models';
import { FrogIcon } from '../../shared/frog-icon/frog-icon';

interface ConsultMessage {
  role: 'assistant' | 'user';
  text: string;
}

@Component({
  selector: 'app-consult-page',
  imports: [FormsModule, FrogIcon],
  template: `
    <section class="page-section consult-page">
      <header class="page-header">
        <p class="eyebrow">The Oracle Bog</p>
        <h1>Consult a Frog</h1>
        <p>
          Each talisman has a personality, an agenda, and strong opinions. Choose your frog wisely —
          this Angular migration keeps consultations as a local consult stub.
        </p>
      </header>

      <div class="personality-grid">
        @for (frog of personalities; track frog.id) {
          <button
            type="button"
            class="personality-card"
            [class.active]="selectedFrog()?.id === frog.id"
            [style.border-color]="selectedFrog()?.id === frog.id ? frog.color : '#2e2e52'"
            (click)="selectFrog(frog)"
          >
            <app-frog-icon [size]="44" [color]="frog.color" />
            <strong>{{ frog.name }}</strong>
            <span>{{ frog.emoji }} {{ frog.tagline }}</span>
          </button>
        }
      </div>

      @if (selectedFrog(); as frog) {
        <article class="consult-chat" [style.border-color]="frog.color + '55'">
          <header [style.background]="'linear-gradient(135deg, ' + frog.color + '22, ' + frog.color + '0a)'">
            <app-frog-icon [size]="38" [color]="frog.color" />
            <div>
              <h2>{{ frog.name }}</h2>
              <p [style.color]="frog.color">{{ frog.tagline }}</p>
            </div>
            <span class="status-dot">In the bog</span>
          </header>

          <div class="message-list">
            @for (message of messages(); track message.text + $index) {
              <div class="message-row" [class.user]="message.role === 'user'">
                @if (message.role === 'assistant') {
                  <app-frog-icon [size]="30" [color]="frog.color" />
                }
                <p>{{ message.text }}</p>
              </div>
            }
          </div>

          <form class="message-form" (ngSubmit)="sendMessage()">
            <textarea
              name="question"
              rows="1"
              [ngModel]="input()"
              (ngModelChange)="input.set($event)"
              [placeholder]="'Ask ' + shortName() + ' something…'"
            ></textarea>
            <button type="submit" class="send-button" [disabled]="!input().trim()">↑</button>
          </form>
        </article>
      } @else {
        <div class="empty-state consult-empty">
          <app-frog-icon [size]="70" color="#1f1f38" />
          <p>Select a frog above to begin the consultation.</p>
          <span>They are ready. They have always been ready.</span>
        </div>
      }

      <p class="fine-print">
        Frog advice is provided for entertainment purposes. OnlyFrogs is not liable for financial decisions made on the advice of crocheted amphibians.
      </p>
    </section>
  `,
})
export class ConsultPage {
  readonly personalities = FROG_PERSONALITIES;
  readonly selectedFrog = signal<FrogPersonality | null>(null);
  readonly messages = signal<ConsultMessage[]>([]);
  readonly input = signal('');
  readonly shortName = computed(() => {
    const frog = this.selectedFrog();
    if (!frog) return 'the frog';
    const parts = frog.name.split(' ');
    return parts.length > 2 ? parts[1] : parts[0];
  });

  selectFrog(frog: FrogPersonality): void {
    this.selectedFrog.set(frog);
    this.messages.set([{ role: 'assistant', text: frog.openingLine }]);
    this.input.set('');
  }

  sendMessage(): void {
    const frog = this.selectedFrog();
    const question = this.input().trim();
    if (!frog || !question) return;

    this.messages.update((messages) => [
      ...messages,
      { role: 'user', text: question },
      {
        role: 'assistant',
        text: `${frog.name} nods solemnly. This is a local consult stub, so the bog offers theatrical wisdom without calling an external API.`,
      },
    ]);
    this.input.set('');
  }
}
