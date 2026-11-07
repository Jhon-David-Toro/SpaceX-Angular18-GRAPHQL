import type { Routes } from '@angular/router';

/** Every feature is lazy-loaded; the initial bundle only carries the shell and the home page. */
export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./features/home/home-page'),
  },
  {
    path: 'lanzamientos',
    title: 'Lanzamientos',
    loadComponent: () => import('./features/launches/archive/launch-archive-page'),
  },
  {
    path: 'lanzamientos/:id',
    title: 'Misión',
    loadComponent: () => import('./features/launches/detail/launch-detail-page'),
  },
  {
    path: 'cohetes',
    title: 'Cohetes',
    loadComponent: () => import('./features/rockets/rockets-page'),
  },
  {
    path: 'flota',
    title: 'Flota de recuperación',
    loadComponent: () => import('./features/fleet/fleet-page'),
  },
  {
    path: 'roadster',
    title: 'Roadster de Starman',
    loadComponent: () => import('./features/roadster/roadster-page'),
  },
  {
    path: 'historia',
    title: 'Hitos',
    loadComponent: () => import('./features/history/history-page'),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () => import('./features/not-found/not-found-page'),
  },
];
