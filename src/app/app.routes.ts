import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { CrearLibroComponent } from './crear-libro/crear-libro.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { FavoritosComponent } from './favoritos/favoritos.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
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
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
  },

  {
    path: 'publicaciones',
    loadComponent: () => import('./publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent),
  },

  {
    path: 'crear_libro',
    loadComponent: () => import('./crear-libro/crear-libro.component').then((m) => m.CrearLibroComponent),
  },



  {
    path: 'login',
    loadComponent: () => import('./login/loginn.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },
];
