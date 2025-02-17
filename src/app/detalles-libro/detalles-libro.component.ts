import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Libro } from "../Models/Libro";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { LibroService } from "../Services/LibroService";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Comentario } from "../Models/Comentario";
import { ComentariosService } from "../Services/ComentarioService";
import { home } from "ionicons/icons";
import {jwtDecode} from 'jwt-decode';
import {FormsModule} from "@angular/forms";
import {UsuarioService} from "../Services/UsuarioService";
import {NavbarComponent} from "../navbar/navbar.component"; // Importar jwt-decode

@Component({
  selector: 'app-detalles-libro',
  templateUrl: './detalles-libro.component.html',
  styleUrls: ['./detalles-libro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, RouterLink, FormsModule, NavbarComponent],
  providers: [LibroService, ComentariosService],
})
export class DetallesLibroComponent implements OnInit {

  libro: Libro | undefined;
  comentarios: Comentario[] = [];
  nuevoComentario: string = '';
  loading = true;
  usuId = this.obtenerUsuarioId();
  esAdmin: boolean = false;


  constructor(private route: ActivatedRoute, private libroService: LibroService, private comentariosService: ComentariosService, private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.usuarioService.obtenerRolUsuario(this.usuId).subscribe(rol => {
      this.esAdmin = rol === 'ADMIN';
    });
    const token = sessionStorage.getItem('authToken');
    console.log('Token:', token);

    const libroId = this.route.snapshot.params['id'];

    if (libroId) {
      this.libroService.getLibro(+libroId).subscribe(
        (libro: Libro) => {
          this.libro = libro;
          console.log('Libro obtenido', libro);
        },
        (error) => {
          console.error('Error al obtener libro', error);
        }
      );

      this.comentariosService.obtenerComentarios(+libroId).subscribe(
        (comentarios: Comentario[]) => {
          this.comentarios = comentarios;
          console.log('Comentarios obtenidos', comentarios);
        },
        (error) => {
          console.error('Error al obtener comentarios', error);
        }
      );
    }
  }

  obtenerUsuarioId(): number {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.tokenDataDTO?.id;
        if (userId !== undefined && userId !== null) {
          return userId;
        } else {
          throw new Error('ID de usuario no encontrado en el token');
        }
      } catch (error) {
        console.error('Error al decodificar el token', error);
        throw new Error('Token inválido');
      }
    }
    throw new Error('Token no encontrado en el sessionStorage');
  }

  cargarComentarios() {
    if (this.libro?.id) {
      this.comentariosService.obtenerComentarios(this.libro.id).subscribe(
        (comentariosActualizados: Comentario[]) => {
          this.comentarios = [...comentariosActualizados]; // Clonamos la lista para forzar cambio
          console.log('Comentarios actualizados:', this.comentarios);
        },
        error => console.error('Error al obtener comentarios actualizados', error)
      );
    }
  }

  eliminarLibro() {
    if (!this.libro?.id) {
      console.error('No se encontró el ID del libro para eliminar');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      this.libroService.eliminarLibro(this.libro.id).subscribe(
        (response: string) => {
          console.log(response);
          alert(response);  // Muestra el mensaje de éxito
          window.location.href = '/publicaciones';
        },
        error => {
          console.error('Error al eliminar el libro', error);
          alert('No se pudo eliminar el libro');
        }
      );
    }
  }



  agregarComentario() {
    const userId = this.obtenerUsuarioId();
    if (!userId) {
      console.error('No se encontró la ID del usuario');
      return;
    }

    if (!this.nuevoComentario.trim()) {
      console.error('El comentario no puede estar vacío');
      return;
    }

    const nuevoComentario: Comentario = {
      usuarioId: userId,
      username: userId,
      comentario: this.nuevoComentario,
      libroId: this.libro?.id || 0,
      fecha: new Date().toISOString().slice(0, 19)
    };

    this.comentariosService.agregarComentario(nuevoComentario).subscribe(
      () => {
        console.log('Comentario agregado con éxito');

        // Limpiar el input
        this.nuevoComentario = '';

        // 🚀 Volver a cargar los comentarios DESDE EL BACKEND
        this.cargarComentarios();
      },
      error => console.error('Error al agregar comentario', error)
    );
  }

  protected readonly home = home;
}
