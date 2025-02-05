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
import {FormsModule} from "@angular/forms"; // Importar jwt-decode

@Component({
  selector: 'app-detalles-libro',
  templateUrl: './detalles-libro.component.html',
  styleUrls: ['./detalles-libro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, RouterLink, FormsModule],
  providers: [LibroService, ComentariosService],
})
export class DetallesLibroComponent implements OnInit {

  libro: Libro | undefined;
  comentarios: Comentario[] = [];
  nuevoComentario: string = ''; // Variable para el comentario nuevo
  loading = true;

  constructor(private route: ActivatedRoute, private libroService: LibroService, private comentariosService: ComentariosService) { }

  ngOnInit() {
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

    console.log('Comentario a publicar:', nuevoComentario);

    this.comentariosService.agregarComentario(nuevoComentario).subscribe(
      () => {
        console.log('Comentario agregado con éxito');
        this.nuevoComentario = ''; // Limpiar el input después de agregar
        this.comentarios.push(nuevoComentario); // Agregar comentario localmente
      },
      error => console.error('Error al agregar comentario', error)
    );
  }

  protected readonly home = home;
}
