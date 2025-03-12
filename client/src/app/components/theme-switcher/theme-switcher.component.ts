import { Component, OnInit } from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <button mat-icon-button (click)="toggleTheme()" [matMenuTriggerFor]="themeMenu">
      <mat-icon>{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
    <mat-menu #themeMenu="matMenu">
      <button mat-menu-item (click)="setTheme('light')">
        <mat-icon>light_mode</mat-icon>
        <span>Light Theme</span>
      </button>
      <button mat-menu-item (click)="setTheme('dark')">
        <mat-icon>dark_mode</mat-icon>
        <span>Dark Theme</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkTheme = false;

  ngOnInit(): void {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    this.setTheme(this.isDarkTheme ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.isDarkTheme = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
} 