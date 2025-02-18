import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { LibroService } from '../services/LibroService';
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
    imports: [
        IonicModule,
        HttpClientModule,
        CommonModule,
        NavbarComponent
    ],
  providers: [LibroService],
})
export class PubAdminComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService) {
    addIcons({ add });
  }

  ngOnInit() {
    this.listarLibros();
  }


  listarLibros() {
    this.libroService.listarlibros().subscribe(
      (libros: Libro[]) => {
        this.libros = libros;
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
