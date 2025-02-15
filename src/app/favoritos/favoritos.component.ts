import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {NavbarComponent} from "../navbar/navbar.component";
import {jwtDecode} from "jwt-decode";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule, NavbarComponent, RouterLink]
})
export class FavoritosComponent implements OnInit {
  librosFavoritos: any[] = [];
  autoresFavoritos: any[] = [];
  librosIds: number[] = [];
  autoresIds: number[] = [];
  userId = this.obtenerUsuarioId();

  constructor(private http: HttpClient,  private router: Router) {}

  ngOnInit(): void {
    this.getLibrosIds();
    this.getAutoresIds();
  }

  getLibrosIds(): void {
    this.http.get<any[]>(`/api/libros-favoritos/yourFaves/${this.userId}`, { observe: 'response' })
      .subscribe({
        next: response => {
          console.log('Response from /libros-favoritos/yourFaves/3:', response);
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
        error: error => {
          console.error('Error fetching libros IDs:', error);
        },
        complete: () => {
          console.log('Request for libros IDs completed.');
        }
      });
  }

  getAutoresIds(): void {
    this.http.get<any[]>(`api/seguidores/tusSeguidos/${this.userId}`, { observe: 'response' })
      .subscribe({
        next: response => {
          console.log('Response from /seguidores/tusSeguidos:', response);
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body) && body.length > 0) {
              this.autoresIds = body
                .filter(item => item.userId !== null) // Filter out items with null userId
                .map(item => item.userId); // Map to userId
              this.getAutoresFavoritos();
            } else {
              console.error('Unexpected response format or empty body:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
          }
        },
        error: error => {
          console.error('Error fetching autores IDs:', error);
        },
        complete: () => {
          console.log('Request for autores IDs completed.');
        }
      });
  }

  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
  }

  getLibrosFavoritos(): void {
    this.librosIds.forEach(id => {
      this.http.get<any>(`/api/libros/${id}`)
        .subscribe({
          next: libro => {
            console.log('Fetched libro favorito:', libro);
            const autorId = libro.autorId;
            this.http.get<any>(`/api/usuario/${autorId}/perfil`)
              .subscribe({
                next: autor => {
                  this.librosFavoritos.push({
                    id: libro.id,
                    nombre: libro.nombre || 'No name available',
                    autor: autor.nombre || 'Unknown',
                    descripcion: libro.descripcion || 'No description available',
                    fecha_publicacion: libro.fechaPublicacion || 'No publication date available',
                    imagen: libro.imagen || 'No image available'
                  });
                },
                error: error => {
                  console.error('Error fetching autor:', error);
                },
                complete: () => {
                  console.log('Request for autor completed.');
                }
              });
          },
          error: error => {
            console.error('Error fetching libro favorito:', error);
          },
          complete: () => {
            console.log('Request for libro favorito completed.');
          }
        });
    });
  }

  getAutoresFavoritos(): void {
    this.autoresIds.forEach(id => {
      if (id !== undefined && id !== null) {
        this.http.get<any>(`/api/usuario/${id}/perfil`)
          .subscribe({
            next: user => {
              console.log('Fetched autor favorito:', user);
              this.autoresFavoritos.push({
                id: user.id,
                nombre: user.nombre,
                imagen: user.imagen
              });
            },
            error: error => {
              console.error('Error fetching autor favorito:', error);
            },
            complete: () => {
              console.log('Request for autor favorito completed.');
            }
          });
      } else {
        console.error('Invalid autor ID:', id);
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
