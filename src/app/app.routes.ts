import { Routes } from '@angular/router';
import { DetallesLibroComponent } from "./detalles-libro/detalles-libro.component";
import { HomePage } from './home/home.page';
import { CrearLibroComponent } from './crear-libro/crear-libro.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { AuthGuard } from "./guards/auth.guard";
import { BanGuard } from './auth/ban.guard';
import {VerificarCodigoComponent} from "./verificar-codigo/verificar-codigo.component";

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard, BanGuard]
  },
  {
    path: 'detallesLibro/:id',
    loadComponent: () => import('./detalles-libro/detalles-libro.component').then((m) => m.DetallesLibroComponent),
    canActivate: [BanGuard]
  },
  {
    path: 'crear-libro',
    loadComponent: () => import('./crear-libro/crear-libro.component').then((m) => m.CrearLibroComponent),
    canActivate: [AuthGuard, BanGuard]
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent),
    canActivate: [AuthGuard, BanGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'libros-favoritos',
    loadComponent: () => import('./favoritos/favoritos.component').then((m) => m.FavoritosComponent),
    canActivate: [AuthGuard, BanGuard]
  },
  {
    path: 'baneos',
    loadComponent: () => import('./bans/bans.component').then((m) => m.BansComponent),
  },


  {
    path: 'verificar-codigo',
    loadComponent: () => import('./verificar-codigo/verificar-codigo.component').then((m) => m.VerificarCodigoComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/loginn.component').then((m) => m.LoginComponent)
  },
  {
    path: 'seguidores',
    loadComponent: () => import('./seguidores/seguidores.component').then((m) => m.SeguidoresComponent),
    canActivate: [BanGuard]
  },
  {
    path: 'perfil/:id',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent),
    canActivate: [AuthGuard, BanGuard]
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.component').then((m) => m.RegistroComponent)
  },
  {
    path: 'pub-admin',
    loadComponent: () => import('./publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent),
    canActivate: [AuthGuard, BanGuard]
  },
  {
    path: 'has-sido-baneado',
    loadComponent: () => import('./has-sido-baneado/has-sido-baneado.component').then((m) => m.HasSidoBaneadoComponent)
  },
  {
    path: 'chats',
    loadComponent: () => import('./chatsgrupales/chatsgrupales.component').then((m) => m.ChatsgrupalesComponent),
  },

  {
    path: 'grupo/:id',
    loadComponent: () => import('./chats/chats.component').then((m) => m.ChatsComponent),
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }


];
