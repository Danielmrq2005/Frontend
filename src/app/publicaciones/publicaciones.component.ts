import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../Services/LibroService';
import {Router, RouterLink} from "@angular/router";
import { finalize } from 'rxjs/operators';
import {NavbarComponent} from "../navbar/navbar.component";
import {jwtDecode} from "jwt-decode";
import { RouterModule } from '@angular/router';
import {Genero} from "../registro/genero.enum";
import {i5Genero} from "../Models/Genero";
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
  generos: Genero = Genero.BIOGRAFICO;
  generosArray = Object.values(i5Genero);
  searchTerm: string = '';
  librosFiltrados: Libro[] = [];


  constructor(private libroService: LibroService, private router: Router) {
    addIcons({ add });
  }
  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
  }

  filtrarLibros(event: any) {
    const texto = event.target.value.toLowerCase();

    if (!texto) {
      this.librosFiltrados = this.libros;
      return;
    }

    this.librosFiltrados = this.libros.filter(libro =>
      libro.nombre.toLowerCase().includes(texto) ||
      libro.username.toLowerCase().includes(texto) ||
      libro.generos.toLowerCase().includes(texto)
    );
  }

  listarLibrosPorGenero() {
    if (!this.generos) {
      this.listarLibros();
      return;
    }

    this.libroService.obtenerLibrosPorGenero(this.generos).subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
      },
      error: (error) => {
        console.error('Error al obtener libros por género', error);
      }
    });
  }

  GeneroCambio() {
    this.listarLibrosPorGenero();
  }


  idactual: number = this.obtenerUsuarioId();


  async ngOnInit() {
    await this.listarLibros();
  }




  listarLibros() {
    this.libroService.listarlibros().pipe(
      finalize(() => {})
    ).subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
        this.librosFiltrados = libros;
      },
      error: (error) => {
        console.error('Error al obtener libros', error);
      }
    });
  }



  // @ts-ignore
  obtenerUsuarioId(): number {
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
      },
      error: (error) => {
        console.error('Error al registrar voto', error);
      }
    });
  }
}
