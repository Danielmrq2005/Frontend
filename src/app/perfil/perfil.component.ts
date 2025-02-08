import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import { Perfil } from '../Models/Perfil';
import {NgForOf, NgStyle} from "@angular/common";
import {Genero} from "../Models/Genero";
import {UsuarioService} from "../Services/UsuarioService";
import {Rol} from "../Models/Rol";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    NgStyle,
    HttpClientModule
  ],
  providers: [UsuarioService]
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

  toggleFollow() {
    this.followText = this.followText === "Seguir" ? "No seguir" : "Seguir";
  }


  constructor(private usuarioservice:UsuarioService) { }

  ngOnInit() {
    this.mostrardatosperfil()
  }

mostrardatosperfil(){
    this.usuarioservice.obetenerPerfil(this.authorid).subscribe(
      (perfilObtenido: Perfil) => {
        this.perfil = perfilObtenido
        console.log("Perfil obtenido: ", perfilObtenido);
      },
      (error) =>
        console.error("Errores al obtener perfil")
    )
}

}
