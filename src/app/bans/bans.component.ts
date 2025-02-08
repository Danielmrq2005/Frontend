import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-bans',
  templateUrl: './bans.component.html',
  styleUrls: ['./bans.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class BansComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.http.get<any[]>('/api/usuario/allPerfiles')
      .subscribe({
        next: response => {
          this.usuarios = response.map(usuario => ({
            ...usuario,
            baneado: false
          }));
          this.checkBanStatus();
        },
        error: error => {
          console.error('Error fetching usuarios:', error);
        }
      });
  }

  checkBanStatus(): void {
    this.usuarios.forEach(usuario => {
      this.http.get<any>(`/api/usuariosBaneados/${usuario.id}`)
        .subscribe({
          next: response => {
            usuario.baneado = response.baneado;
          },
          error: error => {
            console.error(`Error fetching ban status for user ${usuario.id}:`, error);
          }
        });
    });
  }

  toggleBan(usuario: any): void {
    const url = usuario.baneado ? `/api/usuariosBaneados/desbanear/${usuario.id}` : `/api/usuariosBaneados/banear/${usuario.id}`;
    this.http.post(url, {})
      .subscribe({
        next: () => {
          usuario.baneado = !usuario.baneado;
        },
        error: error => {
          console.error(`Error toggling ban status for user ${usuario.id}:`, error);
        }
      });
  }
}
