import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class BanGuard implements CanActivate {

  userId = this.obtenerUsuarioId();
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.http.get<any>(`http://localhost:8080/baneados/getUsuarioBaneado/${this.userId}`).pipe(
      map(response => {
        if (response && response.baneado) {
          this.router.navigate(['/has-sido-baneado']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        return of(true);
      })
    );
  }

  obtenerUsuarioId(): number | null {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.tokenDataDTO?.id || null;
      } catch (error) {
        console.error('Error al decodificar el token', error);
        return null;
      }
    }
    return null;
  }
}
