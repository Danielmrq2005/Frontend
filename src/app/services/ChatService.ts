import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Chat} from "../modelos/Chat";

@Injectable({
  providedIn: 'root',
})

export class ChatService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
  obtenerChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}chat/listar`);
  }



}
