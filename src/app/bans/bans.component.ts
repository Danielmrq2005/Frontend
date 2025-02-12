import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bans',
  templateUrl: './bans.component.html',
  styleUrls: ['./bans.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BansComponent implements OnInit {
  usuarios: any[] = [];
  usuariosId: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.http.get<any[]>('/api/usuario/allPerfiles')
      .subscribe({
        next: response => {
          console.log('Response from /usuario/allPerfiles:', response);
          if (Array.isArray(response)) {
            this.usuariosId = response.map(usuario => usuario.id);
            this.getPerfiles(this.usuariosId);
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        error: error => {
          console.error('Error fetching users:', error);
        },
        complete: () => {
          console.log('Request for users completed.');
        }
      });
  }

  getPerfiles(ids: number[]): void {
    ids.forEach(id => {
      if (id !== undefined) {
        this.http.get<any>(`/api/usuario/${id}/perfil`)
          .subscribe({
            next: response => {
              console.log(`Response from /usuario/${id}/perfil:`, response);
              this.usuarios.push(response);
            },
            error: error => {
              console.error(`Error fetching profile for user ${id}:`, error);
            }
          });
      } else {
        console.error('User ID is undefined');
      }
    });
  }

  banearUsuario(usuarioId: number, motivoBan: string): void {
    const banData = { usuarioId, motivoBan };
    this.http.post('/api/baneados/banearUsuario', banData)
      .subscribe({
        next: response => {
          console.log('User banned successfully:', response);
          const usuario = this.usuarios.find(u => u.id === usuarioId);
          if (usuario) {
            usuario.baneado = true;
          }
        },
        error: error => {
          console.error('Error banning user:', error);
        }
      });
  }

  desbanearUsuario(usuarioId: number): void {
    this.http.delete(`/api/baneados/desbanearUsuario/${usuarioId}`)
      .subscribe({
        next: response => {
          console.log('User unbanned successfully:', response);
          const usuario = this.usuarios.find(u => u.id === usuarioId);
          if (usuario) {
            usuario.baneado = false;
          }
        },
        error: error => {
          console.error('Error unbanning user:', error);
        }
      });
  }
}
