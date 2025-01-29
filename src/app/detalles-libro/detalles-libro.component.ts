import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Libro} from "../Models/Libro";
import {ActivatedRoute} from "@angular/router";
import {LibroService} from "../Services/LibroService";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {Comentario} from "../Models/Comentario";
import {ComentariosService} from "../Services/ComentarioService";

@Component({
  selector: 'app-detalles-libro',
  templateUrl: './detalles-libro.component.html',
  styleUrls: ['./detalles-libro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [LibroService, ComentariosService],
})
export class DetallesLibroComponent  implements OnInit {
  libro: Libro | undefined;
  comentarios: Comentario[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private libroService: LibroService, private comentariosService: ComentariosService) { }

  ngOnInit() {
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


}
