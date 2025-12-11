import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'color';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('dark');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    // Load theme from localStorage on initialization
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'color')) {
      this.setTheme(savedTheme);
    } else {
      // Default to dark theme
      this.setTheme('dark');
    }
  }

  get currentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);

    // Apply theme to document body
    document.body.className = `theme-${theme}`;

    // Update CSS custom properties
    this.updateCSSVariables(theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private updateCSSVariables(theme: Theme): void {
    const root = document.documentElement;

    if (theme === 'dark') {
      // Dark theme: black background, black elements, white text
      root.style.setProperty('--bg-primary', '#000000'); // Black
      root.style.setProperty('--bg-secondary', '#000000'); // Black
      root.style.setProperty('--text-primary', '#FFFFFF'); // White
      root.style.setProperty('--text-secondary', '#CCCCCC'); // Light gray
      root.style.setProperty('--accent-primary', '#000000'); // Black
      root.style.setProperty('--accent-secondary', '#000000'); // Black
    } else if (theme === 'color') {
      // Color theme: purple background, colorful elements
      root.style.setProperty('--bg-primary', '#8A2BE2'); // Blue violet
      root.style.setProperty('--bg-secondary', '#4B0082'); // Indigo
      root.style.setProperty('--text-primary', '#FFFFFF'); // White
      root.style.setProperty('--text-secondary', '#E6E6FA'); // Lavender
      root.style.setProperty('--accent-primary', '#FF1493'); // Deep pink
      root.style.setProperty('--accent-secondary', '#00CED1'); // Dark turquoise
    } else {
      // Light theme: white background, green elements, black text
      root.style.setProperty('--bg-primary', '#FFFFFF'); // White
      root.style.setProperty('--bg-secondary', '#F0F0F0'); // Light gray
      root.style.setProperty('--text-primary', '#000000'); // Black
      root.style.setProperty('--text-secondary', '#333333'); // Dark gray
      root.style.setProperty('--accent-primary', '#008000'); // Green
      root.style.setProperty('--accent-secondary', '#006400'); // Dark green
    }
  }
}
