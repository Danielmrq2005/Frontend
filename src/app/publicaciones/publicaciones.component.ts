import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa este módulo
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../Services/LibroService';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule // Asegúrate de incluirlo aquí
  ],
  providers: [LibroService],
})
export class PublicacionesComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService) {
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
}
