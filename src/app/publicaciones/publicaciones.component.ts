import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {add} from 'ionicons/icons';
import {addIcons} from 'ionicons';
import {Libro} from '../Models/Libro';
import {LibroService} from '../services/LibroService';
import {Router, RouterLink, RouterModule} from "@angular/router";
import {finalize} from 'rxjs/operators';
import {NavbarComponent} from "../navbar/navbar.component";
import {jwtDecode} from "jwt-decode";
import {ComentariosService} from "../services/ComentarioService";
import {Genero} from "../Models/Genero";
import {FormsModule} from "@angular/forms";


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
    NavbarComponent,
    FormsModule
  ],
  providers: [LibroService],
})

export class PublicacionesComponent implements OnInit {
  libros: Libro[] = [];
  totalComentarios: number = 0;
  generos: string | Genero = "Todos";
  generosArray = ["Todos", ...Object.values(Genero)];
  buscador: string = '';
  librosFiltrados: Libro[] = [];


  constructor(private libroService: LibroService, private router: Router, private http: HttpClient, private comentariosService: ComentariosService) {
    addIcons({add});
  }

  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
  }

  idactual: number = this.obtenerUsuarioId();

  async ngOnInit() {
    await this.listarLibros();
  }

  listarLibros() {
    this.libroService.listarlibros().subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
        this.librosFiltrados = [...libros];
        let peticiones = libros.map(libro =>
          this.comentariosService.contarComentarios(libro.id).pipe(
            finalize(() => this.aplicarFiltros())
          ).subscribe(
            (total: number) => libro.totalComentarios = total,
            (error) => console.error('Error al obtener total de comentarios', error)
          )
        );

        Promise.all(peticiones).then(() => this.aplicarFiltros());
      },
      error: (error) => {
        console.error('Error al obtener libros', error);
      }
    });
  }




  // @ts-ignore
  obtenerUsuarioId(): number  {
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
    this.libroService.votarlibro(libroId, usuarioId, esLike).pipe(
      finalize(() => {
      })
    ).subscribe({
      next: (response) => {
        console.log('Voto registrado con éxito');
        this.listarLibros();
        if (esLike) {
          this.anyadirLibroFavorito(usuarioId, libroId);
        } else {
          this.eliminarLibroFavorito(usuarioId, libroId);
        }
      },
      error: (error) => {
        console.error('Error al registrar voto', error);
      }
    });
  }

  anyadirLibroFavorito(userId: number, libroId: number) {
    const url = 'https://wattbook-9uo8.onrender.com/libros-favoritos/anyadirLibroFavorito';
    const body = {userId, libroId};
    this.http.post(url, body).subscribe({
      next: (response) => {
        console.log('Libro añadido a favoritos con éxito:', response);
      },
      error: (error) => {
        console.error('Error al añadir libro a favoritos:', error);
      }
    });
  }

  eliminarLibroFavorito(userId: number, libroId: number) {
    const url = 'https://wattbook-9uo8.onrender.com/libros-favoritos/eliminarLibroFav';
    const body = {userId, libroId};
    this.http.request('delete', url, {body}).subscribe({
      next: (response) => {
        console.log('Libro eliminado de favoritos con éxito:', response);
      },
      error: (error) => {
        console.error('Error al eliminar libro de favoritos:', error);
      }
    });
  }
  onGeneroChange() {
    this.listarLibrosPorGenero();
  }

  listarLibrosPorGenero() {
    if (this.generos === "Todos") {
      this.listarLibros();
      return;
    }

    this.libroService.obtenerLibrosPorGenero(this.generos as Genero).subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al obtener libros por género', error);
      }
    });
  }

  filtrarLibros(event: any) {
    this.buscador = event.target.value.toLowerCase();
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let librosFiltrados = [...this.libros];

    if (this.buscador) {
      librosFiltrados = librosFiltrados.filter(libro =>
        libro.nombre.toLowerCase().includes(this.buscador) ||
        libro.username.toLowerCase().includes(this.buscador) ||
        libro.generos.toLowerCase().includes(this.buscador)
      );
    }

    this.librosFiltrados = librosFiltrados;
  }





}
