import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Libro} from "../Models/Libro";
import {ActivatedRoute} from "@angular/router";
import {LibroService} from "../Services/LibroService";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-detalles-libro',
  templateUrl: './detalles-libro.component.html',
  styleUrls: ['./detalles-libro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [LibroService],
})
export class DetallesLibroComponent  implements OnInit {
  libro: Libro | undefined;

  constructor(private route: ActivatedRoute, private libroService: LibroService) { }

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
    }
  }

}
