import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class BanGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userId = this.obtenerUsuarioId();
    console.log('BanGuard: Checking ban status for user ID:', userId);
    if (userId) {
      return this.http.get<any>(`https://wattbook-5pt2.onrender.com/baneados/getUsuarioBaneado/${userId}`).pipe(
        map(response => {
          console.log('BanGuard: Response from ban check:', response);
          if (response && response.usuarioId && response.usuarioId.id === userId) {
            console.log('BanGuard: User is banned, redirecting...');
            this.router.navigate(['/has-sido-baneado']);
            return false;
          }
          return true;
        }),
        catchError(error => {
          console.error('BanGuard: Error checking ban status:', error);
          return of(true);
        })
      );
    } else {
      console.log('BanGuard: No user ID found, redirecting to login...');
      this.router.navigate(['/login']);
      return of(false);
    }
  }

  obtenerUsuarioId(): number | null {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.tokenDataDTO?.id || null;
      } catch (error) {
        console.error('BanGuard: Error decoding token', error);
        return null;
      }
    }
    return null;
  }
}
