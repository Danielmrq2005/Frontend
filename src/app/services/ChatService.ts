import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Chat} from "../Models/Chat";

@Injectable({
  providedIn: 'root',
})

export class ChatService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
  obtenerChatsPorUsuario(usuarioId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chat/listar/${usuarioId}`);
  }

  obtenerChatPorId(chatId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/${chatId}`);
  }

}
