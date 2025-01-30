import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../Services/LibroService';
import {UsuarioService} from "../Services/UsuarioService";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-crea-libro',
  templateUrl: './crear-libro.component.html',
  styleUrls: ['./crear-libro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  providers: [LibroService,UsuarioService],
})

export class CrearLibroComponent implements OnInit {
  nombre: string = '';
  generos: string = '';
  descripcion: string = '';
  imagen: string = '';
  autorId: number = 1;
  username: string = '';
  fecha_publicacion: Date = new Date();
  constructor(
    private libroService: LibroService,
    private usuarioService: UsuarioService
  ) {
  }

  ngOnInit() {
  }

  async obtenerUsername(autorId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.usuarioService.obtenerUsername(autorId).subscribe({
        next: (nombre) => resolve(nombre), // Devuelve el nombre
        error: (error) => reject(error)    // Maneja el error
      });
    });
  }
  async crearLibro() {
    this.fecha_publicacion = new Date();

    if (this.nombre && this.generos && this.descripcion && this.imagen) {
      try {
        this.username = await this.obtenerUsername(this.autorId);
        const datoslibro = {
          nombre: this.nombre,
          generos: this.generos,
          descripcion: this.descripcion,
          imagen: this.imagen,
          autorId: this.autorId,
          username: this.username,
          fecha_publicacion: this.fecha_publicacion,
        };

        this.libroService.publicarlibro(datoslibro).subscribe({
          next: (response) => {
            console.log('Libro creado exitosamente', response);
          },
          error: (error) => {
            console.error('Error al crear el libro', error);
          },
        });
      } catch (error) {
        console.error('Error al obtener el username', error);
      }
    } else {
      console.error('Por favor, complete todos los campos');
    }
  }
}
