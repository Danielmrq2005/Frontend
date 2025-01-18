import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'detallesLibro',
    loadComponent: () => import('./detalles-libro/detalles-libro.component').then((m) => m.DetallesLibroComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
