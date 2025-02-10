import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Libro } from '../Models/Libro';
import { RouterModule } from '@angular/router';
import { LibroService } from '../Services/LibroService';
import { finalize } from 'rxjs/operators';
import {jwtDecode} from "jwt-decode";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    RouterLink
  ],
  providers: [LibroService],
})

export class PublicacionesComponent implements OnInit {
  libros: Libro[] = [];

    constructor(private libroService: LibroService) {
    addIcons({ add });
  }

  idactual: number = this.obtenerUsuarioId();

  async ngOnInit() {
    await this.listarLibros();
  }




  listarLibros() {
    this.libroService.listarlibros().pipe(
      finalize(() => {
      })
    ).subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
      },
      error: (error) => {
        console.error('Error al obtener libros', error);
      }
    });
  }


  // @ts-ignore
  obtenerUsuarioId(): number {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.tokenDataDTO?.id || null;
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }
  }



  votar(libroId: number, esLike: boolean) {
    const usuarioId = this.obtenerUsuarioId();
    this.libroService.votarlibro(libroId, usuarioId, esLike).pipe(
      finalize(() => {
      })
    ).subscribe({
      next: (response) => {
        console.log('Voto registrado con éxito');
        this.listarLibros();
      },
      error: (error) => {
        console.error('Error al registrar voto', error);
      }
    });
  }
}
