import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule]
})
export class FavoritosComponent implements OnInit {
  librosFavoritos: any[] = [];
  autoresFavoritos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLibrosFavoritos();
    this.getAutoresFavoritos();
  }

  getLibrosFavoritos(): void {
    this.http.get<any[]>('/api/libros-favoritos/listaLibros')
      .subscribe(
        data => {
          console.log('Fetched libros favoritos:', data);
          this.librosFavoritos = data.map(libro => {
            console.log('Processing libro:', libro);
            return {
              id: libro.libroId.id,
              nombre: libro.libroId.nombre || 'No name available',
              autor: libro.libroId.autorId ? libro.libroId.autorId.username : 'Unknown',
              descripcion: libro.libroId.descripcion || 'No description available',
              fecha_publicacion: libro.libroId.fechaPublicacion || 'No publication date available',
              imagen: libro.libroId.imagen || 'No image available'
            };
          });
        },
        error => {
          console.error('Error fetching libros favoritos:', error);
        }
      );
  }

  getAutoresFavoritos(): void {
    this.http.get<any[]>('/api/seguidores/listaSeguidores')
      .subscribe(
        data => {
          console.log('Fetched autores favoritos:', data);
          data.forEach(seguidor => {
            this.http.get<any>(`/api/usuario/${seguidor.seguidorId}/perfil`)
              .subscribe(
                user => {
                  this.autoresFavoritos.push({
                    id: user.id,
                    nombre: user.nombre ,
                    apellido: user.apellido,
                    imagen: user.imagen
                  });
                },
                error => {
                  console.error('Error fetching autor favorito:', error);
                }
              );
          });
        },
        error => {
          console.error('Error fetching autores favoritos:', error);
        }
      );
  }
}
