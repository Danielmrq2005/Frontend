import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Libro} from "../Models/Libro";
import {Perfil} from "../Models/Perfil";
import {Usuario} from "../Models/Usuario";
import {Verificacion} from "../Models/Verificacion";

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


  obtenerUsernameMensaje(id: number | null): Observable<string> {
    return this.http.get(`http://localhost:8080/usuario/${id}/mensaje`, { responseType: 'text' });
  }

  comprobarverificado(id: number | null): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/comprobarVerificacion/${id}`, {}, { responseType: 'json' });
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


  verificarCodigo(verificacionDTO: Verificacion): Observable<any> {
    const url = `${this.apiUrl}/verificar-codigo`;
    return this.http.post(url, verificacionDTO, { responseType: 'text' });
  }


  obtenerRolUsuario(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/rol/${id}`, { responseType: 'text' });
  }


}
