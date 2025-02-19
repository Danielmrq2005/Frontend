import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ChatMensaje } from "../Models/Chatmensajes";

@Injectable({
  providedIn: 'root',
})
export class ChatMensajeService implements OnDestroy {
  private apiUrl = environment.apiUrl + '/chatmensaje';
  private intervalId: any;

  constructor(private http: HttpClient) {
    this.startMessageReload();
  }

  crearMensaje(mensaje: ChatMensaje): Observable<ChatMensaje> {
    return this.http.post<ChatMensaje>(`${this.apiUrl}/crear`, mensaje);
  }

  obtenerMensajesDeChat(chatId: number): Observable<ChatMensaje[]> {
    return this.http.get<ChatMensaje[]>(`${this.apiUrl}/chat/${chatId}`);
  }

  eliminarMensaje(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  private startMessageReload() {
    this.intervalId = setInterval(() => {
      const chatId = 1;
      this.obtenerMensajesDeChat(chatId).subscribe({
        next: (mensajes) => {
          console.log('Mensajes recargados:', mensajes);
        },
        error: (error) => {
          console.error('Error al recargar mensajes', error);
        }
      });
    }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
