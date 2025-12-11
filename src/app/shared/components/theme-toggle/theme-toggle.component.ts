import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select
      class="theme-select"
      [value]="currentTheme"
      (change)="setTheme($event)"
      aria-label="Seleccionar tema">
      <option value="light">Claro</option>
      <option value="dark">Oscuro</option>
    </select>
  `,
  styles: [`
    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--bg-secondary, rgba(255, 255, 255, 0.1));
      border: 2px solid var(--accent-primary, rgba(255, 255, 255, 0.2));
      border-radius: 25px;
      color: var(--text-primary, white);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .theme-toggle-btn:hover {
      background: var(--accent-primary, rgba(102, 126, 234, 0.2));
      border-color: var(--accent-primary, #667eea);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .theme-toggle-btn i {
      font-size: 1.1rem;
      color: var(--accent-primary, #667eea);
    }

    .theme-text {
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .theme-toggle-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }

      .theme-text {
        display: none;
      }
    }
  `]
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  get currentTheme(): Theme {
    return this.themeService.currentTheme;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setTheme(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.themeService.setTheme(target.value as Theme);
  }
}
