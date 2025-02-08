import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NgForOf } from "@angular/common";
import { HttpClient } from "@angular/common/http";

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSeguidoresId();
  }

  getSeguidoresId(): void {
    this.http.get<any[]>(`api/seguidores/listaSeguidores/2`, { observe: 'response' })
      .subscribe({
        next: response => {
          console.log('Response from /seguidores/listaSeguidores/2:', response);
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body)) {
              this.seguidoresId = body.map(item => item.seguidorId);
              this.getSeguidores();
            } else {
              console.error('Unexpected response format:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
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

  getSeguidores(): void {
    this.seguidoresId.forEach(id => {
      this.http.get<any>(`/api/usuario/${id}/perfil`)
        .subscribe({
          next: user => {
            console.log('Fetched seguidor:', user);
            this.seguidores.push({
              id: user.id,
              nombre: user.nombre,
              imagen: user.imagen
            });
          },
          error: error => {
            console.error('Error fetching seguidor:', error);
          },
          complete: () => {
            console.log('Request for seguidor completed.');
          }
        });
    });
  }

  dejarSeguirte(id: number): void {
    const body = { id: id };
    this.http.post<any>(`/api/seguidores/eliminarSeguidor`, body)
      .subscribe({
        next: response => {
          console.log(`Response from /seguidores/eliminarSeguidor:`, response);
          this.seguidores = this.seguidores.filter(seguidor => seguidor.id !== id);
        },
        error: error => {
          console.error(`Error deleting seguidor with id ${id}:`, error);
        },
        complete: () => {
          console.log(`Request for deleting seguidor with id ${id} completed.`);
        }
      });
  }
}
