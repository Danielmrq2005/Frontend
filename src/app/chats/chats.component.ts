import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ChatMensaje } from "../modelos/Chatmensajes";
import { ChatMensajeService } from "../Services/ChatMensajeService";
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, KeyValuePipe} from "@angular/common";
import {ChatService} from "../Services/ChatService";
import {IonContent} from "@ionic/angular/standalone";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    KeyValuePipe,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [ChatMensajeService]
})
export class ChatsComponent implements OnInit {
  mensajes: ChatMensaje[] = [];
  nuevoMensaje: string = '';
  chatId: number = 1;
  usuarioId: number = 1;
  private chatSubscription!: Subscription;
  @ViewChild('content') content!: IonContent;


  constructor(private chatMensajesService: ChatMensajeService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.chatId = +(this.route.snapshot.paramMap.get('id') || 1);
    this.usuarioId = +(this.route.snapshot.paramMap.get('id') || 1);

    if (this.chatId) {
      this.cargarMensajes();
    }

    this.chatSubscription = interval(30000).subscribe(() => {
      this.cargarMensajes();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(0); // Prueba con 500ms para un desplazamiento más suave
      }
    }, 0);
  }


  cargarMensajes() {
    if (!this.chatId) return;

    this.chatMensajesService.obtenerMensajesDeChat(this.chatId).subscribe((data) => {
      this.mensajes = data;
    });
  }

  enviarMensaje() {
    if (!this.chatId || !this.usuarioId) return;

    const mensaje: ChatMensaje = {
      mensaje: this.nuevoMensaje,
      fecha: new Date(),
      chatId: this.chatId,
      usuarioId: this.usuarioId,
    };

    this.chatMensajesService.crearMensaje(mensaje).subscribe(() => {
      this.nuevoMensaje = '';
      this.cargarMensajes();
    });
  }
}
