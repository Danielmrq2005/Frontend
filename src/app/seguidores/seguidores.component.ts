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
              this.seguidoresId = [...new Set(body)]; // Ensure unique IDs
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

  getSeguidores(): void {
    this.seguidoresId.forEach(id => {
      if (id !== undefined) {
        this.http.get<any>(`/api/usuario/${id}/perfil`)
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
