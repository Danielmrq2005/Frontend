import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, KeyValuePipe} from "@angular/common";
import {ChatUsuarioService} from "../Services/ChatUsuarioService";
import {Chatusuarios} from "../modelos/Chatusuarios";
import {finalize} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-chatsgrupales',
  templateUrl: './chatsgrupales.component.html',
  styleUrls: ['./chatsgrupales.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    KeyValuePipe,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ChatsgrupalesComponent  implements OnInit {

  constructor(private chatusuarioService: ChatUsuarioService) { }

  ngOnInit() {}






  agregarUsuarioschat(){

    const userId = this.obtenerUsuarioId();

    if (!userId) {
      console.error('No se encontró la ID del usuario');
      return;
    }


    const nuevousuario:Chatusuarios  = {
        usuarioId: userId,
        chatId:chatId,

      };

      this.comentariosService.agregarComentario(nuevoComentario).subscribe(
        () => {
          console.log('Comentario agregado con éxito');

          // Limpiar el input
          this.nuevoComentario = '';

          // 🚀 Volver a cargar los comentarios DESDE EL BACKEND
          this.cargarComentarios();
        },
        error => console.error('Error al agregar comentario', error)
      );
    }

  protected readonly home = home;
  }

  }

  crearChat(){

  }



}
