import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Libro} from "../Models/Libro";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuario';
  constructor(private http: HttpClient) {
  }

  obtenerUsername(autorId: number): Observable<string> {
    return this.http.get<string>(`http://localhost:8081/usuario/${autorId}/username`, { responseType: 'text' as 'json' });
  }
  obetenerPerfil(id: number | null): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}/perfil`);
  }


  obtenerUsernameMensaje(id: number | null): Observable<string> {
    return this.http.get(`http://localhost:8080/usuario/${id}/mensaje`, { responseType: 'text' });
  }

  comprobarverificado(id: number | null): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/comprobarVerificacion/${id}`, {}, { responseType: 'json' });
  }


  obtenerPublicaciones(id: number | null): Observable<Libro[]>{
    return this.http.get<Libro[]>(`${this.apiUrl}/perfil/publicaciones/${id}`)
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
