import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular'; // Importa AlertController
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LibroService } from '../Services/LibroService';
import { UsuarioService } from "../Services/UsuarioService";
import { FormsModule } from "@angular/forms";
import { finalize } from 'rxjs/operators'; // Importa finalize

@Component({
  selector: 'app-crea-libro',
  templateUrl: './crear-libro.component.html',
  styleUrls: ['./crear-libro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [LibroService, UsuarioService],
})

export class CrearLibroComponent implements OnInit {
  nombre: string = '';
  generos: string = '';
  descripcion: string = '';
  imagen: string = '';
  autorId: number = 1;
  username: string = '';
  fecha_publicacion: Date = new Date();

  imagendefecto: string = 'assets/images.jpg'

  constructor(
    private libroService: LibroService,
    private usuarioService: UsuarioService,
    private alertController: AlertController  // Inyectamos AlertController
  ) { }

  ngOnInit() { }

  comprobarimagen() {
    if (!this.imagen) {
      this.imagen = this.imagendefecto;
    } else {
      const img = new Image();
      img.src = this.imagen;
      img.onerror = () => {
        this.imagen = this.imagendefecto;
      };
    }
  }

  obtenerUsername(autorId: number): void {
    this.usuarioService.obtenerUsername(autorId).pipe(
      finalize(() => {
        console.log('Operación de obtener username finalizada');
      })
    ).subscribe({
      next: (nombre) => {
        this.username = nombre;
        console.log('Username obtenido: ', this.username);
      },
      error: (error) => {
        console.error('Error al obtener el username', error);
        this.mostrarAlerta('Error', 'No se pudo obtener el nombre de usuario.');
      }
    });
  }

  crearLibro() {
    this.comprobarimagen();
    this.fecha_publicacion = new Date();

    if (this.nombre && this.generos && this.descripcion && this.imagen) {
      this.obtenerUsername(this.autorId); // Obtén el username antes de crear el libro

      const datoslibro = {
        nombre: this.nombre,
        generos: this.generos,
        descripcion: this.descripcion,
        imagen: this.imagen,
        autorId: this.autorId,
        username: this.username,
        fecha_publicacion: this.fecha_publicacion,
      };

      this.libroService.publicarlibro(datoslibro).pipe(
        finalize(() => {
          console.log('Operación de crear libro finalizada');
        })
      ).subscribe({
        next: (response) => {
          console.log('Libro creado exitosamente', response);
          this.mostrarAlerta('Éxito', 'Libro creado exitosamente');
        },
        error: (error) => {
          console.error('Error al crear el libro', error);
          this.mostrarAlerta('Error', `Error al crear el libro: ${error.message}`);
        }
      });
    } else {
      this.mostrarAlerta('Campos incompletos', 'Por favor, complete todos los campos');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
