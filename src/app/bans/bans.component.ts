import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-bans',
  templateUrl: './bans.component.html',
  styleUrls: ['./bans.component.scss'],
  standalone: true,
    imports: [IonicModule, CommonModule, NavbarComponent]
})
export class BansComponent implements OnInit {
  usuarios: any[] = [];
  usuariosId: number[] = [];
  usuariosBaneados: any[] = [];

  constructor(private http: HttpClient, private alertController: AlertController) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.getUsuariosBaneados();
  }

  getUsuarios(): void {
    this.http.get<any[]>('https://wattbook-9uo8.onrender.com/usuario/allPerfiles')
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
        this.http.get<any>(`https://wattbook-9uo8.onrender.com/usuario/${id}/perfil`)
          .subscribe({
            next: response => {
              console.log(`Response from /usuario/${id}/perfil:`, response);
              this.usuarios.push(response);
              this.updateUsuariosBaneados();
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

  getUsuariosBaneados(): void {
    this.http.get<any[]>('https://wattbook-9uo8.onrender.com/baneados/getUsuariosBaneados')
      .subscribe({
        next: response => {
          console.log('Response from /baneados/getUsuariosBaneados:', response);
          this.usuariosBaneados = response.map(ban => ban.usuarioId);
          this.updateUsuariosBaneados();
        },
        error: error => {
          console.error('Error fetching banned users:', error);
        }
      });
  }

  updateUsuariosBaneados(): void {
    this.usuarios.forEach(usuario => {
      const isBanned = this.usuariosBaneados.some(bannedUser => bannedUser.id === usuario.id);
      usuario.baneado = isBanned;
    });
  }

  async showBanPopup(usuarioId: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Motivo del Ban',
      inputs: [
        {
          name: 'motivoBan',
          type: 'text',
          placeholder: 'Ingrese el motivo del ban'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Banear',
          handler: (data) => {
            this.banearUsuario(usuarioId, data.motivoBan);
          }
        }
      ]
    });

    await alert.present();
  }

  banearUsuario(usuarioId: number, motivoBan: string): void {
    const banData = { usuarioId, motivoBan };
    this.http.post('https://wattbook-9uo8.onrender.com/baneados/banearUsuario', banData)
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
    this.http.delete(`https://wattbook-9uo8.onrender.com/baneados/eliminarBaneo/${usuarioId}`)
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
