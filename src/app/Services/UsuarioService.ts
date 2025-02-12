import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Libro} from "../Models/Libro";
import {Perfil} from "../Models/Perfil";
import {Usuario} from "../Models/Usuario";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuario';
  private apiUrlLibros = 'http://localhost:8080/libros';
  constructor(private http: HttpClient) {
  }

  obtenerUsername(autorId: number | null): Observable<Perfil> {
    return this.http.get<Perfil>(`http://localhost:8080/usuario/${autorId}/username`, { responseType: 'text' as 'json' });
  }

  obetenerPerfil(id: number | null): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}/perfil`);
  }


  obtenerPublicaciones(id: number | null): Observable<Libro[]>{
    return this.http.get<Libro[]>(`${this.apiUrlLibros}/perfil/publicaciones/${id}`)
  }

  obtenerPerfilPorUsername(username: string): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/perfil/${username}`);
  }

  obtenerPublicacionesPorUsername(username: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/publicaciones/${username}`);
  }

  obtenerRolUsuario(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/rol/${id}`, { responseType: 'text' });
  }


}
