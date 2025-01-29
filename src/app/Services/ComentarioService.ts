import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Comentario} from "../Models/Comentario";

@Injectable({
  providedIn: 'root',
})

export class ComentariosService {
  private apiUrl = 'http://localhost:8080/comentarios';

  constructor(private http: HttpClient) {
  }

  obtenerComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.apiUrl);
  }
}
