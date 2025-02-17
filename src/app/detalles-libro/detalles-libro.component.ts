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
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from "@angular/forms";
import { UsuarioService } from "../Services/UsuarioService";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-detalles-libro',
  templateUrl: './detalles-libro.component.html',
  styleUrls: ['./detalles-libro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, NavbarComponent],
  providers: [LibroService, ComentariosService],
})
export class DetallesLibroComponent implements OnInit {

  libro: Libro | undefined;
  comentarios: Comentario[] = [];
  nuevoComentario: string = '';
  loading = true;
  usuId = this.obtenerUsuarioId();
  esAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private libroService: LibroService, private comentariosService: ComentariosService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioService.obtenerRolUsuario(this.usuId).subscribe({
      next: (rol) => {
        this.esAdmin = rol === 'ADMIN';
      },
      error: (error) => {
        console.error('Error al obtener el rol del usuario', error);
      }
    });

    const token = sessionStorage.getItem('authToken');
    console.log('Token:', token);

    const libroId = this.route.snapshot.params['id'];

    if (libroId) {
      this.libroService.getLibro(+libroId).subscribe({
        next: (libro: Libro) => {
          this.libro = libro;
          console.log('Libro obtenido', libro);
        },
        error: (error) => {
          console.error('Error al obtener libro', error);
        }
      });

      this.comentariosService.obtenerComentarios(+libroId).subscribe({
        next: (comentarios: Comentario[]) => {
          this.comentarios = comentarios;
          console.log('Comentarios obtenidos', comentarios);
        },
        error: (error) => {
          console.error('Error al obtener comentarios', error);
        }
      });
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
      this.comentariosService.obtenerComentarios(this.libro.id).subscribe({
        next: (comentariosActualizados: Comentario[]) => {
          this.comentarios = [...comentariosActualizados];
          console.log('Comentarios actualizados:', this.comentarios);
        },
        error: (error) => {
          console.error('Error al obtener comentarios actualizados', error);
        }
      });
    }
  }

  eliminarLibro() {
    if (!this.libro?.id) {
      console.error('No se encontró el ID del libro para eliminar');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      this.libroService.eliminarLibro(this.libro.id).subscribe({
        next: (response: string) => {
          console.log(response);
          alert(response);
          window.location.href = '/publicaciones';
        },
        error: (error) => {
          console.error('Error al eliminar el libro', error);
          alert('No se pudo eliminar el libro');
        }
      });
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

    this.comentariosService.agregarComentario(nuevoComentario).subscribe({
      next: () => {
        console.log('Comentario agregado con éxito');
        this.nuevoComentario = '';
        this.cargarComentarios();
      },
      error: (error) => {
        console.error('Error al agregar comentario', error);
      }
    });
  }

  protected readonly home = home;
}
