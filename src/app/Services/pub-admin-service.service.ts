import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Libro} from "../Models/Libro";

@Injectable({
  providedIn: 'root'
})
export class PubAdminServiceService {
  private apiUrl = 'http://localhost:8080/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // CAMBIAR POR EL TOKEN
    })
  };

  constructor(private http: HttpClient) { }

  listarlibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}libros/MostrarLibros`, this.httpOptions);
  }

  votarlibro(libroId: number, usuarioId: number, esLike: boolean): Observable<any> {
    const data = { libroId, usuarioId, esLike };
    return this.http.post<any>(`${this.apiUrl}libros/votar`, data, this.httpOptions);
  }

  eliminarLibro(libroId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}libros/eliminar/${libroId}`, this.httpOptions);
  }
}
