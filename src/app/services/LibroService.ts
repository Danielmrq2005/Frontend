import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Libro} from "../Models/Libro";

@Injectable({
  providedIn: 'root',
})

export class LibroService {
  private apiUrl = 'http://localhost:8080/libros';


  constructor(private http: HttpClient) {
  }


  listarlibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  publicarlibro(libro: Partial<Libro>): Observable<Libro> {
    return this.http.post<Libro>(`${this.apiUrl}/crear`, libro);
  }

  votarlibro(libroId: number, usuarioId: number, esLike: boolean): Observable<any> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('esLike', esLike.toString());

    return this.http.post(`${this.apiUrl}/votar/${libroId}`, {}, {params});
  }
  getLibro(libroId: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${libroId}`);
  }
  obtenerTop4Libros(): Observable<Libro[]> {
    return this.http.get<Libro[]>('http://localhost:8080/votos/top4');
  }



}
