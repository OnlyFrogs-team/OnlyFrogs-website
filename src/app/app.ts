import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './services/theme.service';
import { Footer } from './shared/footer/footer';
import { Nav } from './shared/nav/nav';
import { TweaksPanel } from './shared/tweaks-panel/tweaks-panel';

@Component({
  selector: 'app-root',
  imports: [Footer, Nav, RouterOutlet, TweaksPanel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly theme = inject(ThemeService);
}
