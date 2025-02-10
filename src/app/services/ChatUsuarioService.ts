import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class ChatUsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  obtenerUsuariosEnChat(chatId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${chatId}`);
  }

  obtenerChatsDeUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chats/${usuarioId}`);
  }




}
