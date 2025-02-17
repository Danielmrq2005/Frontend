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
import { Genero } from "../Models/Genero";
import {jwtDecode} from "jwt-decode"; // Import Router
import {ChatUsuarioService} from "../Services/ChatUsuarioService";
import {Chatusuarios} from "../modelos/Chatusuarios";
import {ChatService} from "../Services/ChatService";



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
  libro: Libro | undefined;

  nombre: string = '';
  generos: Genero = Genero.BIOGRAFICO;
  descripcion: string = '';
  imagen: string = '';
  username: string = '';
  fechaPublicacion: Date = new Date();

  imagendefecto: string = 'assets/images.jpg'

  generosArray = Object.values(Genero);

  constructor(
      private libroService: LibroService,
      private usuarioService: UsuarioService,
      private alertController: AlertController,
      private Chatusuario: ChatUsuarioService,
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

    if (this.nombre && this.generos && this.descripcion && this.imagen) {
      this.obtenerUsername(autorId);

      this.usuarioService.obtenerUsername(autorId).pipe(
        finalize(() => console.log('Operación de obtener username finalizada'))
      ).subscribe({
        next: (nombre) => {
          this.username = nombre.nombre;

          const datoslibro = {
            nombre: this.nombre,
            generos: this.generos,
            descripcion: this.descripcion,
            imagen: this.imagen,
            autorId: autorId,
            username: this.username,
            fechaPublicacion: new Date(),
          };

          this.libroService.publicarlibro(datoslibro).pipe(
            finalize(() => console.log('Operación de crear libro finalizada'))
          ).subscribe({
            next: (response) => {
              console.log('Libro creado exitosamente', response);
              this.libro = response; // Asigna el libro creado a la propiedad libro
              this.mostrarAlerta('Éxito', 'Libro creado exitosamente');
              this.router.navigate(['/publicaciones']);
              this.crearChat();
            },
            error: (error) => {
              console.error('Error al crear el libro', error);
              this.mostrarAlerta('Error', `Error al crear el libro: ${error.message}`);
            }
          });
        },
        error: (error) => {
          console.error('Error al obtener el username', error);
          this.mostrarAlerta('Error', 'No se pudo obtener el nombre de usuario.');
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

  crearChat() {

  if (!this.libro?.id) {
    console.error('No se encontró el ID del libro');
    return;
  }


    const chatData = {
    nombre: this.libro.nombre,
    descripcion: `Chat sobre ${this.libro.nombre}`,
    imagen: this.libro.imagen,
    libroId: this.libro.id
  };

  this.libroService.crearChat(chatData).subscribe(
    (chatId: number) => {
      console.log('Chat creado con ID:', chatId);
      this.unirseChat(chatId);
    },
    error => console.error('Error al crear chat', error)
  );
}

  unirseChat(chatId: number) {
    const userId = this.obtenerUsuarioId();
    if (!userId) {
      console.error('No se encontró la ID del usuario');
      return;
    }

    const nuevousuario: Chatusuarios = {
      usuarioId: userId,
      chatId: chatId
    };

    this.Chatusuario.agregarUsuarioAlChat(nuevousuario).subscribe(
      () => console.log('Usuario agregado al chat con éxito'),
      error => console.error('Error al agregar usuario al chat', error)
    );
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
