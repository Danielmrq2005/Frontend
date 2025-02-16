import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, KeyValuePipe} from "@angular/common";
import {ChatUsuarioService} from "../Services/ChatUsuarioService";
import {Chatusuarios} from "../modelos/Chatusuarios";
import {finalize} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {Chat} from "../modelos/Chat";
import {ChatService} from "../Services/ChatService";
import {routes} from "../app.routes";
import {Router, RouterLink} from "@angular/router";


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
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [ChatService]
})
export class ChatsgrupalesComponent implements OnInit {

  chats: Chat[] = [];

  constructor(private chatService: ChatService,private router: Router) {}

  ngOnInit() {
    this.obtenerChats();
  }

  obtenerUsuarioId(): number | null {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.tokenDataDTO?.id || null;
      } catch (error) {
        console.error('Error al decodificar el token', error);
        return null;
      }
    }
    return null;
  }

  obtenerChats() {
    const usuarioId = this.obtenerUsuarioId();
    if (usuarioId) {
      this.chatService.obtenerChatsPorUsuario(usuarioId).subscribe((chats) => {
        this.chats = chats;
      }, error => {
        console.error('Error al obtener chats del usuario', error);
      });
    } else {
      console.error('No se pudo obtener la ID del usuario');
    }
  }


  Vergrupos(chatId: number) {
    this.router.navigate(['grupo', chatId]);
  }

    protected readonly routes = routes;
}


