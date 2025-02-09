import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import { Perfil } from '../Models/Perfil';
import {NgForOf, NgStyle} from "@angular/common";
import {Genero} from "../Models/Genero";
import {UsuarioService} from "../Services/UsuarioService";
import {LibroService} from "../Services/LibroService";
import {Rol} from "../Models/Rol";
import { HttpClientModule } from '@angular/common/http';
import {Libro} from "../Models/Libro";
import {finalize} from "rxjs/operators";
import { CommonModule } from '@angular/common';


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
  providers: [UsuarioService,LibroService]
})
export class PerfilComponent  implements OnInit {
  followText: string = "Seguir";
  perfil: Perfil = {
    id: 0,
    nombre: '',
    apellidos: '',
    descripcion: '',
    email: '',
    imagen: '',
    generos: Genero.AVENTURA,
    usuario: { id: 0, username: '', password: '', rol: Rol.USER }
  };

  authorid: number = 1

  Publicaciones: Libro[] = []

  toggleFollow() {
    this.followText = this.followText === "Seguir" ? "No seguir" : "Seguir";
  }


  constructor(private usuarioservice:UsuarioService,private libroservice:LibroService ) { }

  ngOnInit() {
    this.mostrardatosperfil()
    this.mostrarpublicacionesperfil()
  }

mostrardatosperfil(){
    this.usuarioservice.obetenerPerfil(this.authorid).subscribe(
      (perfilObtenido: Perfil) => {
        this.perfil = perfilObtenido
        console.log("Perfil obtenido: ", perfilObtenido);
      },
      (error) =>
        console.error("Errores al obtener perfil",error)
    )
}

mostrarpublicacionesperfil(){
    this.usuarioservice.obtenerPublicaciones(this.authorid).subscribe(
      (publicaciones : Libro[]) => {
        this.Publicaciones = publicaciones
        console.log("Publicaciones obtenidas",publicaciones)
      },
      (error) =>
        console.error("Error al obtener las publicaciones del usuario",error)
    )
}

  votar(libroId: number, esLike: boolean) {
    const usuarioId = 1;
    this.libroservice.votarlibro(libroId, usuarioId, esLike).pipe(
      finalize(() => {
      })
    ).subscribe({
      next: (response) => {
        console.log('Voto registrado con éxito');
        this.mostrarpublicacionesperfil()
      },
      error: (error) => {
        console.error('Error al registrar voto', error);
      }
    });
  }

}
