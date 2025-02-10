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
    return this.http.get<string>(`http://localhost:8080/usuario/${autorId}/username`, { responseType: 'text' as 'json' });
  }



}
