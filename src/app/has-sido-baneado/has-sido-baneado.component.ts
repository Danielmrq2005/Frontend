import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-has-sido-baneado',
  templateUrl: './has-sido-baneado.component.html',
  imports: [
    CommonModule,
    IonicModule
  ],
  styleUrls: ['./has-sido-baneado.component.scss']
})
export class HasSidoBaneadoComponent implements OnInit {
  usuarioId: any = {};
  fechaBaneo: string = '';
  motivoBaneo: string = '';
  userId = this.obtenerUsuarioId();


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsuarioBaneado();
  }

  getUsuarioBaneado(): void {
    this.http.get<any>(`https://wattbook.onrender.com/baneados/getUsuarioBaneado/${this.userId}`)
      .subscribe({
        next: response => {
          this.usuarioId = response.usuarioId;
          this.fechaBaneo = response.fechaBaneo;
          this.motivoBaneo = response.motivoBaneo;
        },
        error: error => {
          console.error('Error fetching banned user details:', error);
        }
      });
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
