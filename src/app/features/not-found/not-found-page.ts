import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page">
      <header class="page-intro">
        <h1>Fuera de trayectoria</h1>
        <p>Esta dirección no corresponde a ninguna página del archivo.</p>
      </header>
      <p class="actions">
        <a class="button" data-variant="primary" routerLink="/">Volver al inicio</a>
        <a class="button" routerLink="/lanzamientos">Ver lanzamientos</a>
      </p>
    </div>
  `,
  styles: `
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }
  `,
})
export default class NotFoundPage {}
