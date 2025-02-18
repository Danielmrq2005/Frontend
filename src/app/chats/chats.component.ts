import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatMensaje } from "../Models/Chatmensajes";
import { ChatMensajeService } from "../Services/ChatMensajeService";
import { IonicModule, IonContent } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Subscription, interval, forkJoin } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { Perfil } from "../Models/Perfil";
import { Genero } from "../Models/Genero";
import { Rol } from "../Models/Rol";
import { UsuarioService } from "../Services/UsuarioService";
import { Libro } from "../Models/Libro";
import { Chat } from "../Models/Chat";
import { ChatService } from "../Services/ChatService";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, HttpClientModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [ChatMensajeService]
})
export class ChatsComponent implements OnInit {
  mensajes: ChatMensaje[] = [];
  nuevoMensaje: string = '';
  chatId = this.route.snapshot.params['id'];
  chat: Chat | null = null;
  usuarioId = this.obtenerUsuarioId();
  private chatSubscription!: Subscription;
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
  Publicaciones: Libro[] = [];
  chats: Chat[] = [];

  @ViewChild('content') content!: IonContent;

  constructor(private chatMensajesService: ChatMensajeService, private route: ActivatedRoute, private usuarioService: UsuarioService, private chatService: ChatService) {}

  ngOnInit() {
    if (this.chatId) {
      this.cargarMensajes();
    }
    this.cargarPerfil();
    this.chatSubscription = interval(30000).subscribe(() => {
      this.cargarMensajes();
    });
    this.obtenerChats();

    this.chatService.obtenerChatPorId(this.chatId).subscribe({
      next: data => {
        if (data) {
          this.chat = data;
        }
      },
      error: error => {
        console.error('Error al obtener el chat:', error);
      }
    });
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
      this.chatService.obtenerChatsPorUsuario(usuarioId).subscribe({
        next: chats => {
          this.chats = chats;
        },
        error: error => {
          console.error('Error al obtener chats del usuario', error);
        }
      });
    } else {
      console.error('No se pudo obtener la ID del usuario');
    }
  }

  cargarPerfil() {
    if (this.usuarioId) {
      forkJoin([
        this.usuarioService.obetenerPerfil(this.usuarioId),
        this.usuarioService.obtenerPublicaciones(this.usuarioId)
      ]).subscribe({
        next: ([perfilObtenido, publicaciones]: [Perfil, Libro[]]) => {
          this.perfil = perfilObtenido;
          this.Publicaciones = publicaciones;
          console.log("Perfil cargado:", this.perfil);
          console.log("Publicaciones cargadas:", this.Publicaciones);
        },
        error: error => {
          console.error("Error al obtener datos del perfil:", error);
        }
      });
    } else {
      console.error("No se pudo obtener el ID del usuario.");
    }
  }

  cargarMensajes() {
    if (!this.chatId) return;
    this.chatMensajesService.obtenerMensajesDeChat(this.chatId).subscribe({
      next: data => {
        this.mensajes = data;
        this.scrollToBottom();
        console.log(this.mensajes);
        console.log(this.usuarioId);
      },
      error: error => {
        console.error('Error al obtener mensajes del chat:', error);
      }
    });
  }

  enviarMensaje() {
    if (!this.chatId || !this.usuarioId || !this.nuevoMensaje.trim()) return;

    const mensaje: ChatMensaje = {
      mensaje: this.nuevoMensaje,
      fecha: new Date(),
      chatId: this.chatId,
      usuarioId: this.usuarioId,
    };

    this.chatMensajesService.crearMensaje(mensaje).subscribe({
      next: () => {
        this.nuevoMensaje = '';
        this.cargarMensajes();
        console.log(this.usuarioId);
      },
      error: error => {
        console.error('Error al enviar mensaje:', error);
      }
    });
    console.log(mensaje);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(0);
      }
    }, 100);
  }

  protected readonly sessionStorage = sessionStorage;
}
