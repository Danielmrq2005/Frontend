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
  ],
  providers: [ChatService]
})
export class ChatsgrupalesComponent implements OnInit {

  nombreLibro: string = '';
  chats: any[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.obtenerChats();
  }

  obtenerChats() {
    this.chatService.obtenerChats().subscribe((chats) => {
      this.chats = chats;
      if (this.chats.length > 0) {
        this.nombreLibro = this.chats[0].nombre;
      }
    });
  }

  crearNuevoChat() {
    console.log('Función para crear un nuevo chat');
  }
}


