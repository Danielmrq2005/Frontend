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
import {NavbarComponent} from "../navbar/navbar.component";  // Importa finalize

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    RouterLink,
    NavbarComponent
  ],
  providers: [LibroService],
})
export class PublicacionesComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService, private router: Router) {
    addIcons({ add });
  }
  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
  }

  async ngOnInit() {
    await this.listarLibros();
  }

  listarLibros() {
    this.libroService.listarlibros().pipe(
      finalize(() => {
        console.log('La operación de listar libros ha terminado');
      })
    ).subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
      },
      error: (error) => {
        console.error('Error al obtener libros', error);
      }
    });
  }

  votar(libroId: number, esLike: boolean) {
    const usuarioId = 1;
    this.libroService.votarlibro(libroId, usuarioId, esLike).pipe(
      finalize(() => {
        console.log('La operación de votar ha terminado');
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
