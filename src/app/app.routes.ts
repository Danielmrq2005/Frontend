import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'crear-libro',
    loadComponent: () => import('./crear-libro/crear-libro.component').then((m) => m.CrearLibroComponent),
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'libros-favoritos',
    loadComponent: () => import('./favoritos/favoritos.component').then((m) => m.FavoritosComponent),

  },
  {
    path: 'pub-admin',
    loadComponent: () => import('./pub-admin/pub-admin.component').then((m) => m.PubAdminComponent),
  }

];
