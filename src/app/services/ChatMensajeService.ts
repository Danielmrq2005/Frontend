import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChatMensaje} from "../Models/Chatmensajes";

@Injectable({
  providedIn: 'root',
})

export class ChatMensajeService {
  private apiUrl = environment.apiUrl + '/chatmensaje';

  constructor(private http: HttpClient) {
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

}
