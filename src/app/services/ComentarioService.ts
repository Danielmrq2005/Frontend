import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Comentario} from "../Models/Comentario";
import {environment} from "../../environments/environment";
import {ComunService} from "./comun.service";

@Injectable({
  providedIn: 'root',
})

export class ComentariosService {
  private apiUrl = environment.apiUrl + '/comentarios';

  constructor(private http: HttpClient, private comunService: ComunService) {
  }

  obtenerComentarios(libroId: number): Observable<Comentario[]> {
    const url = `${this.apiUrl}/libro/${libroId}`;
    return this.http.get<Comentario[]>(url);
  }
  agregarComentario(comentario: Comentario): Observable<any> {
    const authHeader = this.comunService.autorizarPeticion();
    return this.http.post<any>(this.apiUrl, comentario, authHeader);
  }
  contarComentarios(libroId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cont/${libroId}`);
  }



}
