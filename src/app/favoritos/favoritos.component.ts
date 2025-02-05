import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {RouterLink} from "@angular/router";

// CAMBIAR LOS ID'S HARCODEADOS CUANDO TENGAMOS EL EXTRAER USUARIO

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  standalone: true,
    imports: [CommonModule, HttpClientModule, IonicModule, RouterLink]
})
export class FavoritosComponent implements OnInit {
  librosFavoritos: any[] = [];
  autoresFavoritos: any[] = [];
  librosIds: number[] = [];
  autoresIds: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLibrosIds();
    this.getAutoresIds();
  }

  getLibrosIds(): void {
    this.http.get<any[]>(`/api/libros-favoritos/yourFaves/3`, { observe: 'response' })
      .subscribe(
        response => {
          console.log('Response from /libros-favoritos/yourFaves/1:', response);
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body)) {
              this.librosIds = body.map(item => item.libroId);
              this.getLibrosFavoritos();
            } else {
              console.error('Unexpected response format:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
            console.error('Response text:', response.body);
          }
        },
        error => {
          console.error('Error fetching libros IDs:', error);
        }
      );
  }

  getAutoresIds(): void {
    this.http.get<any[]>(`api/seguidores/tusSeguidos/3`, { observe: 'response' })
      .subscribe(
        response => {
          console.log('Response from /seguidores/tusSeguidos/1:', response);
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body)) {
              this.autoresIds = body.map(item => item.seguidorId);
              this.getAutoresFavoritos();
            } else {
              console.error('Unexpected response format:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
          }
        },
        error => {
          console.error('Error fetching autores IDs:', error);
        }
      );
  }

  getLibrosFavoritos(): void {
    this.librosIds.forEach(id => {
      this.http.get<any>(`/api/libros/${id}`)
        .subscribe(
          libro => {
            console.log('Fetched libro favorito:', libro);
            const autorId = libro.autorId;
            this.http.get<any>(`/api/usuario/${autorId}/perfil`)
              .subscribe(
                autor => {
                  this.librosFavoritos.push({
                    id: libro.id,
                    nombre: libro.nombre || 'No name available',
                    autor: autor.nombre || 'Unknown',
                    descripcion: libro.descripcion || 'No description available',
                    fecha_publicacion: libro.fechaPublicacion || 'No publication date available',
                    imagen: libro.imagen || 'No image available'
                  });
                },
                error => {
                  console.error('Error fetching autor:', error);
                }
              );
          },
          error => {
            console.error('Error fetching libro favorito:', error);
          }
        );
    });
  }

  getAutoresFavoritos(): void {
    this.autoresIds.forEach(id => {
      this.http.get<any>(`/api/usuario/${id}/perfil`)
        .subscribe(
          user => {
            console.log('Fetched autor favorito:', user);
            this.autoresFavoritos.push({
              id: user.id,
              nombre: user.nombre,
              imagen: user.imagen
            });
          },
          error => {
            console.error('Error fetching autor favorito:', error);
          }
        );
    });
  }
}
