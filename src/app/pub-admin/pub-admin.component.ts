import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgForOf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { PubAdminServiceService } from '../Services/pub-admin-service.service';

@Component({
  selector: 'app-pub-admin',
  templateUrl: './pub-admin.component.html',
  styleUrls: ['./pub-admin.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    HttpClientModule,
    CommonModule
  ],
  providers: [PubAdminServiceService]
})
export class PubAdminComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: PubAdminServiceService) {
    addIcons({ add });
  }

  ngOnInit() {
    this.listarLibros();
  }

  listarLibros() {
    this.libroService.listarlibros().subscribe(
      (libros: Libro[]) => {
        this.libros = libros;
      },
      (error) => {
        console.error('Error al obtener libros', error);
      }
    );
  }

  eliminarLibro(libroId: number) {
    this.libroService.eliminarLibro(libroId).subscribe(
      (response) => {
        console.log('Libro eliminado con éxito:', response);
        this.listarLibros(); // Actualizar la lista de libros después de eliminar
      },
      (error) => {
        console.error('Error al eliminar libro', error);
      }
    );
  }

  votar(libroId: number, esLike: boolean) {
    const usuarioId = 1;
    this.libroService.votarlibro(libroId, usuarioId, esLike).subscribe(
      (response) => {
        console.log('Voto registrado con éxito:', response);
        this.listarLibros();
      },
      (error) => {
        console.error('Error al votar libro', error);
      }
    );
  }
}
