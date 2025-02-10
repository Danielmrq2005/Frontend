import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Perfil } from '../Models/Perfil';
import { NgForOf, NgStyle } from '@angular/common';
import { UsuarioService } from "../Services/UsuarioService";
import { LibroService } from "../Services/LibroService";
import { Rol } from "../Models/Rol";
import { HttpClientModule } from '@angular/common/http';
import { Libro } from "../Models/Libro";
import { finalize } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Genero } from "../registro/genero.enum";
import { forkJoin } from 'rxjs';
import { Usuario } from "../Models/Usuario";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    NgStyle,
    HttpClientModule,
    CommonModule
  ],
  providers: [UsuarioService, LibroService]
})
export class PerfilComponent implements OnInit {
  followText: string = "Seguir";
  perfil: Perfil = {
    id: 0,
    nombre: '',
    apellidos: '',
    descripcion: '',
    email: '',
    imagen: '',
    generos: Genero.AVENTURA,
    usuario: {id: 0, username: '', password: '', rol: Rol.USER}
  };
  username: string = '';


  idactual: number | null = this.obtenerUsuarioId();

  usuarioId: number = 0;
  Publicaciones: Libro[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private libroService: LibroService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id')!; // Asegúrate de que el 'id' de la URL sea numérico
      this.usuarioId = id;
      this.cargarPerfil();
      console.log('Usuario logueado (ID):', this.obtenerUsuarioId());
      console.log('Perfil (ID):', id);
    });
  }

  cargarPerfil() {
    // Verificamos que tenemos el ID del usuario en la URL
    if (this.usuarioId) {
      forkJoin([
        this.usuarioService.obetenerPerfil(this.usuarioId),
        this.usuarioService.obtenerPublicaciones(this.usuarioId)
      ]).subscribe(
        ([perfilObtenido, publicaciones]) => {
          this.perfil = perfilObtenido;
          this.Publicaciones = publicaciones;
          console.log("Perfil cargado:", this.perfil);
          console.log("Publicaciones cargadas:", this.Publicaciones);
        },
        error => console.error("Error al obtener datos del perfil:", error)
      );
    } else {
      console.error("No se pudo obtener el ID del usuario.");
    }
  }

  toggleFollow() {
    if (this.perfil.id !== this.usuarioId) {
      this.followText = this.followText === "Seguir" ? "No seguir" : "Seguir";
    }
  }

  // @ts-ignore
  obtenerUsuarioId(): number{
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.tokenDataDTO?.id || null;
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }

  }

  votar(libroId: number, esLike: boolean) {
    const usuarioId = this.obtenerUsuarioId();
    this.libroService.votarlibro(libroId, usuarioId, esLike).pipe(
      finalize(() => {
      })
    ).subscribe({
      next: (response) => {
        console.log('Voto registrado con éxito');
        this.cargarPerfil()
      },
      error: (error) => {
        console.error('Error al registrar voto', error);
      }
    });
  }
}
