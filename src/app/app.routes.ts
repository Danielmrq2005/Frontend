import { Routes } from '@angular/router';
import {DetallesLibroComponent} from "./detalles-libro/detalles-libro.component";
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
    path: 'detallesLibro/:id',
    loadComponent: () => import('./detalles-libro/detalles-libro.component').then((m) => m.DetallesLibroComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'libros-favoritos',
    loadComponent: () => import('./favoritos/favoritos.component').then((m) => m.FavoritosComponent),

  },

  {
    path: 'publicaciones',
    loadComponent: () => import('./publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/loginn.component').then((m) => m.LoginComponent),
  },

  {
    path: 'crear-libro',
    loadComponent: () => import('./crear-libro/crear-libro.component').then((m) => m.CrearLibroComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'pub-admin',
    loadComponent: () => import('./pub-admin/pub-admin.component').then((m) => m.PubAdminComponent),
  }

];
