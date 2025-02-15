import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../Services/LibroService';
import { Router, RouterLink } from "@angular/router";
import { finalize } from 'rxjs/operators';
import { NavbarComponent } from "../navbar/navbar.component";
import { jwtDecode } from "jwt-decode";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    RouterLink,
    NavbarComponent
  ],
  providers: [LibroService],
})

export class PublicacionesComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService, private router: Router, private http: HttpClient) {
    addIcons({ add });
  }

  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
  }

  idactual: number = this.obtenerUsuarioId();

  async ngOnInit() {
    await this.listarLibros();
  }

  listarLibros() {
    this.libroService.listarlibros().pipe(
      finalize(() => {
      })
    ).subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
      },
      error: (error: any) => {
        console.error('Error al obtener libros', error);
      }
    });
  }


  // @ts-ignore
  obtenerUsuarioId(): number{
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.tokenDataDTO?.id || null;
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }

  }

  votar(libroId: number, esLike: boolean) {
    const usuarioId = this.obtenerUsuarioId();
    const url = esLike
      ? 'http://localhost:8080/libros-favoritos/anyadirLibroFavorito'
      : 'http://localhost:8080/libros-favoritos/eliminarLibroFav';
    const body = { userId: usuarioId, libroId: libroId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (esLike) {
      this.http.post(url, body, { headers }).pipe(
        finalize(() => {
          this.listarLibros();
        })
      ).subscribe({
        next: (response: any) => {
          console.log('Libro añadido a favoritos con éxito');
        },
        error: (error: any) => {
          console.error('Error al añadir libro a favoritos', error);
        }
      });
    } else {
      this.http.delete(url, { headers, body }).pipe(
        finalize(() => {
          this.listarLibros();
        })
      ).subscribe({
        next: (response: any) => {
          console.log('Libro eliminado de favoritos con éxito');
        },
        error: (error: any) => {
          console.error('Error al eliminar libro de favoritos', error);
        }
      });
    }
  }
}
