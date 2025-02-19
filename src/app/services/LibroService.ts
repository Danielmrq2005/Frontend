import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Libro} from "../Models/Libro";
import {Genero} from "../Models/Genero";

@Injectable({
  providedIn: 'root',
})

export class LibroService {
  private apiUrl = 'https://wattbook.onrender.com/libros';
  private apiUrl2 = 'https://wattbook.onrender.com/chat';
  private apiUrl3 = 'https://wattbook.onrender.com/chatusuario';



  constructor(private http: HttpClient) {
  }


  listarlibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  publicarlibro(libro: Partial<Libro> | null): Observable<Libro> {
    return this.http.post<Libro>(`${this.apiUrl}/crear`, libro);
  }

  votarlibro(libroId: number, usuarioId: number | null   , esLike: boolean): Observable<any> {
    if (usuarioId === null) {
      throw new Error('usuarioId cannot be null');
    }

    const params = new HttpParams()
        .set('usuarioId', usuarioId.toString())
        .set('esLike', esLike.toString());

    return this.http.post(`${this.apiUrl}/votar/${libroId}`, {}, {params});
  }
  getLibro(libroId: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${libroId}`);
  }
  obtenerTop4Libros(): Observable<Libro[]> {
    return this.http.get<Libro[]>('https://wattbook.onrender.com/votos/top4');
  }
  eliminarLibro(libroId: number) {
    return this.http.delete(`${this.apiUrl}/elim/${libroId}`, {responseType: 'text'});
  }

  obtenerPublicacionesPorUsername(username: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/publicaciones/${username}`);
  }

  agregarUsuarioAlChat(chatUsuariosDTO: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl3}/agregar`, chatUsuariosDTO);
  }

  crearChat(chatData: any): Observable<number> {
    return this.http.post<number>(`${this.apiUrl2}/crear`, chatData);
  }

  obtenerLibrosPorGenero(genero: Genero): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/genero/${genero}`);
  }



}
