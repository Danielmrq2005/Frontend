import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular'; // Importa AlertController
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {add, image} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../Services/LibroService';
import { UsuarioService } from "../Services/UsuarioService";
import { FormsModule } from "@angular/forms";
import { finalize } from 'rxjs/operators';
import {NavbarComponent} from "../navbar/navbar.component";
import {ReactiveFormsModule} from "@angular/forms";
import { Router } from '@angular/router';
import { Genero } from "../registro/genero.enum";
import { i5Genero } from "../Models/Genero";
import {jwtDecode} from "jwt-decode"; // Import Router



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
    ReactiveFormsModule,
    NavbarComponent
  ],
  providers: [LibroService, UsuarioService],
})

export class CrearLibroComponent implements OnInit {
  nombre: string = '';
  generos: Genero = Genero.BIOGRAFICO;
  descripcion: string = '';
  imagen: string = '';
  username: string = '';
  fecha_publicacion: Date = new Date();

  imagendefecto: string = 'assets/images.jpg'

  generosArray = Object.values(i5Genero);

  constructor(
      private libroService: LibroService,
      private usuarioService: UsuarioService,
      private alertController: AlertController,
      private router: Router
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

  obtenerUsername(autorId: number | null): void {
    this.usuarioService.obtenerUsername(autorId).pipe(
        finalize(() => {
          console.log('Operación de obtener username finalizada');
        })
    ).subscribe({
      next: (nombre) => {
        this.username = nombre.nombre;
        console.log('Username obtenido: ', this.username);
      },
      error: (error) => {
        console.error('Error al obtener el username', error);
        this.mostrarAlerta('Error', 'No se pudo obtener el nombre de usuario.');
      }
    });
  }

  crearLibro() {
    const autorId = this.obtenerUsuarioId();
    this.comprobarimagen();
    this.fecha_publicacion = new Date();

    if (this.nombre && this.generos && this.descripcion && this.imagen) {
      this.obtenerUsername(autorId);

      const datoslibro = {
        nombre: this.nombre,
        generos: this.generos,
        descripcion: this.descripcion,
        imagen: this.imagen,
        autorId: autorId,
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
          this.router.navigate(['/publicaciones']);
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

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
