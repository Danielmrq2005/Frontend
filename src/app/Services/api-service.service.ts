import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // CAMBIAR POR EL TOKEN
    })
  };

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ruta-de-datos`, this.httpOptions);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ruta-de-datos`, data, this.httpOptions);
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ruta-de-datos/${id}`, this.httpOptions);
  }

  getLibro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}libros/listaLibros`, this.httpOptions);
  }

  getLibrosFav(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}libros-favoritos/listaLibros`, this.httpOptions);
  }

  anyadirLibroFav(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}libros-favoritos/anyadirLibroFavorito`, data, this.httpOptions);
  }

  borrarLibroFav(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}librosFavoritos/borrarLibroFavorito/${id}`, this.httpOptions);
  }

  getSeguidores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}seguidores/listaSeguidores`, this.httpOptions);
  }

  anyadirSeguidor(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}seguidores/anyadirSeguidor`, data, this.httpOptions);
  }

  borrarSeguidor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}seguidores/eliminarSeguidor/${id}`, this.httpOptions);
  }
}
