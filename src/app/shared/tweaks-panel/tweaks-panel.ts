import { Component, inject } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-tweaks-panel',
  template: `
    @if (theme.panelOpen()) {
      <aside class="tweaks-panel" aria-label="Visual tweaks">
        <h3 [style.font-family]="theme.headingFont()">Tweaks</h3>

        <label>Accent Color</label>
        <div class="swatch-row">
          @for (color of accentColors; track color) {
            <button
              type="button"
              class="round-swatch"
              [class.selected]="theme.accentColor() === color"
              [style.background]="color"
              [attr.aria-label]="'Use accent color ' + color"
              (click)="theme.setAccentColor(color)"
            ></button>
          }
        </div>

        <label>Background</label>
        <div class="swatch-row">
          @for (option of backgrounds; track option.color) {
            <button
              type="button"
              class="square-swatch"
              [class.selected]="theme.bgColor() === option.color"
              [style.background]="option.color"
              [title]="option.label"
              (click)="theme.setBackgroundColor(option.color)"
            ></button>
          }
        </div>

        <label>Font Mood</label>
        <div class="segment-row">
          <button
            type="button"
            [class.selected]="theme.fontStyle() === 'classic'"
            (click)="theme.setFontStyle('classic')"
          >
            Serif
          </button>
          <button
            type="button"
            [class.selected]="theme.fontStyle() === 'modern'"
            (click)="theme.setFontStyle('modern')"
          >
            Sans
          </button>
        </div>
      </aside>
    }
  `,
})
export class TweaksPanel {
  readonly theme = inject(ThemeService);
  readonly accentColors = ['#7ecac3', '#c8956a', '#b87aff', '#5a8a4a'];
  readonly backgrounds = [
    { color: '#0d0d1a', label: 'Dark bog' },
    { color: '#0d1a0d', label: 'Forest deep' },
    { color: '#1a0d1a', label: 'Witch purple' },
  ];
}
