import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NgForOf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.component.html',
  styleUrls: ['./seguidores.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf
  ]
})
export class SeguidoresComponent implements OnInit {
  seguidores: any[] = [];
  seguidoresId: number[] = [];
  usuId = this.obtenerUsuarioId();


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSeguidoresId();
  }



  getSeguidoresId(): void {
    this.http.get<any[]>(`https://wattbook.onrender.com/seguidores/listaSeguidores/${this.usuId}`, { observe: 'response' })
      .subscribe({
        next: response => {
          console.log('Response from /seguidores/listaSeguidores/2:', response);
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body)) {
              this.seguidoresId = [...new Set(body)];
              this.getSeguidores();
            } else {
              console.error('Unexpected response format:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
            console.error('Response text:', response.body);
          }
        },
        error: error => {
          console.error('Error fetching seguidores IDs:', error);
        },
        complete: () => {
          console.log('Request for seguidores IDs completed.');
        }
      });
  }

  obtenerUsuarioId(): number {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.tokenDataDTO?.id;
        if (userId !== undefined && userId !== null) {
          return userId;
        } else {
          throw new Error('ID de usuario no encontrado en el token');
        }
      } catch (error) {
        console.error('Error al decodificar el token', error);
        throw new Error('Token inválido');
      }
    }
    throw new Error('Token no encontrado en el sessionStorage');
  }


  getSeguidores(): void {
    this.seguidoresId.forEach(id => {
      if (id !== undefined) {
        this.http.get<any>(`https://wattbook.onrender.com/usuario/${id}/perfil`)
          .subscribe({
            next: response => {
              console.log(`Response from /usuario/${id}/perfil:`, response);
              this.seguidores.push(response);
            },
            error: error => {
              console.error(`Error fetching seguidor ${id} profile:`, error);
            }
          });
      } else {
        console.error('Seguidor ID is undefined');
      }
    });
  }
}
