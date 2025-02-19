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
  private apiUrl = 'https://wattbook.onrender.com/usuario';
  private apiUrlLibros = 'https://wattbook.onrender.com/libros';
  constructor(private http: HttpClient) {
  }

  obtenerUsername(autorId: number | null): Observable<Perfil> {
    return this.http.get<Perfil>(`https://wattbook.onrender.com/usuario/${autorId}/username`, { responseType: 'text' as 'json' });
  }

  obetenerPerfil(id: number | null): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}/perfil`);
  }


  obtenerUsernameMensaje(id: number | null): Observable<string> {
    return this.http.get(`https://wattbook.onrender.com/usuario/${id}/mensaje`, { responseType: 'text' });
  }

  comprobarverificado(id: number | null): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/comprobarVerificacion/${id}`, {}, { responseType: 'json' });
  }


  obtenerPublicaciones(id: number | null): Observable<Libro[]>{
    return this.http.get<Libro[]>(`${this.apiUrlLibros}/perfil/publicaciones/${id}`)
  }

  verificarCodigo(verificacionDTO: Verificacion): Observable<any> {
    const url = `${this.apiUrl}/verificar-codigo`;
    return this.http.post(url, verificacionDTO, { responseType: 'text' });
  }


  obtenerRolUsuario(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/rol/${id}`, { responseType: 'text' });
  }


}
