import { Routes } from '@angular/router';

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
