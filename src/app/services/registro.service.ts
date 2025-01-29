import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {Registro} from "../modelos/Registro";

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = environment.apiUrl;

  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();


  constructor(private http: HttpClient) {
  }
  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }


  registrar(registro: Registro): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/auth/registro/perfil`,registro) ;
  }

}
