import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { ThemeTweaks } from '../data/onlyfrogs.models';

export const DEFAULT_THEME_TWEAKS: ThemeTweaks = {
  accentColor: '#5a8a4a',
  bgColor: '#0d0d1a',
  fontStyle: 'classic',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly tweakState = signal<ThemeTweaks>(DEFAULT_THEME_TWEAKS);

  readonly tweaks = this.tweakState.asReadonly();
  readonly accentColor = computed(() => this.tweaks().accentColor);
  readonly bgColor = computed(() => this.tweaks().bgColor);
  readonly fontStyle = computed(() => this.tweaks().fontStyle);
  readonly headingFont = computed(() =>
    this.fontStyle() === 'classic' ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
  );
  readonly panelOpen = signal(false);

  constructor() {
    effect(() => {
      const tweaks = this.tweaks();
      const body = this.document.body;
      body.style.background = tweaks.bgColor;
      body.style.setProperty('--of-bg', tweaks.bgColor);
      body.style.setProperty('--of-accent', tweaks.accentColor);
      body.style.setProperty('--of-heading-font', this.headingFont());
    });
  }

  setAccentColor(accentColor: string): void {
    this.tweakState.update((tweaks) => ({ ...tweaks, accentColor }));
  }

  setBackgroundColor(bgColor: string): void {
    this.tweakState.update((tweaks) => ({ ...tweaks, bgColor }));
  }

  setFontStyle(fontStyle: ThemeTweaks['fontStyle']): void {
    this.tweakState.update((tweaks) => ({ ...tweaks, fontStyle }));
  }

  togglePanel(): void {
    this.panelOpen.update((open) => !open);
  }
}
