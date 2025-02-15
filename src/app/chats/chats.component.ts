import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatMensaje } from "../modelos/Chatmensajes";
import { ChatMensajeService } from "../Services/ChatMensajeService";
import { IonicModule, IonContent } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Subscription, interval } from "rxjs";
import { jwtDecode } from "jwt-decode";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

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
  usuarioId = this.obtenerUsuarioId();
  private chatSubscription!: Subscription;


  @ViewChild('content') content!: IonContent;

  constructor(private chatMensajesService: ChatMensajeService, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.chatId) {
      this.cargarMensajes();
    }

    this.chatSubscription = interval(30000).subscribe(() => {
      this.cargarMensajes();
    });
  }

  cargarMensajes() {
    if (!this.chatId) return;
    this.chatMensajesService.obtenerMensajesDeChat(this.chatId).subscribe((data) => {
      this.mensajes = data;
      this.scrollToBottom();
      console.log(this.mensajes);
      console.log(this.usuarioId);
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

    this.chatMensajesService.crearMensaje(mensaje).subscribe(() => {
      this.nuevoMensaje = '';
      this.cargarMensajes();
      console.log(this.usuarioId);
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

  protected readonly sessionStorage = sessionStorage;
}
