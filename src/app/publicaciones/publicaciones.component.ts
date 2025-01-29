import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../Services/LibroService';
import {Router} from "@angular/router";

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [LibroService],
})
export class PublicacionesComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService, private router: Router) {
    addIcons({ add });
  }
  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
  }

  ngOnInit() {
    this.listarLibros();
  }

  listarLibros() {
    this.libroService.listarlibros().subscribe(
      (libros: Libro[]) => {
        this.libros = libros;
        console.log('Libros obtenidos con exito: ', libros);
      },
      (error) => {
        console.error('Error al obtener libros', error);
      }
    );
  }

  votar(libroId: number, esLike: boolean){
    const usuarioId = 1
    this.libroService.votarlibro(libroId,usuarioId,esLike).subscribe(
      (response) =>{
        console.log('Voto registrado con exito: ', response)
        this.listarLibros()
      },
      (error) =>{
        console.error('Error al obtener libros', error);
      }
    )
  }
}
