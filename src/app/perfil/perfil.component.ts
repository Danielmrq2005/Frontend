import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Perfil } from '../Models/Perfil';
import { NgForOf, NgStyle } from '@angular/common';
import { UsuarioService } from "../services/UsuarioService";
import { LibroService } from "../services/LibroService";
import { Rol } from "../Models/Rol";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Libro } from "../Models/Libro";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Genero } from "../registro/genero.enum";
import { forkJoin } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";
import {ComentariosService} from "../Services/ComentarioService";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    HttpClientModule,
    CommonModule,
    NavbarComponent,
    RouterLink
  ],
  providers: [UsuarioService, LibroService]
})
export class PerfilComponent implements OnInit {
  followText: string = "Seguir";
  perfil: Perfil = {
    id: 0,
    nombre: '',
    apellidos: '',
    descripcion: '',
    email: '',
    imagen: '',
    generos: Genero.AVENTURA,
    usuario: { id: 0, username: '', password: '', rol: Rol.USER }
  };
  autoresIds: number[] = [];
  username: string = '';
  autoresFavoritos: any[] = [];
  seguidores: any[] = [];
  seguidoresId: number[] = [];
  idactual: number | null = this.obtenerUsuarioId();
  usuarioId: number = 0;
  Publicaciones: Libro[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private libroService: LibroService,
    private http: HttpClient,
    private comentariosService: ComentariosService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.usuarioId = id;
      this.cargarPerfil();
      console.log('Usuario logueado (ID):', this.obtenerUsuarioId());
      console.log('Perfil (ID):', id);

      this.getAutoresIds();
      this.getAutoresFavoritos();
      this.getSeguidoresId();

      const followState = localStorage.getItem(`followState_${this.usuarioId}`);
      if (followState === 'true') {
        this.followText = "Dejar de seguir";
      } else {
        this.followText = "Seguir";
      }
    });
  }

  ionViewWillEnter() {
    this.cargarPerfil();
  }


  cargarPerfil() {
    if (this.usuarioId) {
      forkJoin([
        this.usuarioService.obetenerPerfil(this.usuarioId),
        this.usuarioService.obtenerPublicaciones(this.usuarioId)
      ]).subscribe({
        next: ([perfilObtenido, publicaciones]) => {
          this.perfil = perfilObtenido;
          this.Publicaciones = publicaciones;

          let peticiones = publicaciones.map(libro =>
            this.comentariosService.contarComentarios(libro.id).pipe(
              finalize(() => this.Publicaciones = [...this.Publicaciones]) // ✅ Corrección aquí
            ).subscribe(
              (total: number) => libro.totalComentarios = total,
              (error) => console.error('Error al obtener total de comentarios', error)
            )
          );

          Promise.all(peticiones).then(() => this.Publicaciones = [...this.Publicaciones]);
        },
        error: error => console.error("Error al obtener datos del perfil:", error)
      });
    } else {
      console.error("No se pudo obtener el ID del usuario.");
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
      }
    }
    return null;
  }

  getAutoresIds(): void {
    this.http.get<any[]>(`https://wattbook.onrender.com/seguidores/tusSeguidos/${this.idactual}`, { observe: 'response' })
      .subscribe({
        next: response => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body)) {
              this.autoresIds = body.map(item => item.seguidorId);
              this.getAutoresFavoritos();
            } else {
              console.error('Unexpected response format:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
          }
        },
        error: error => {
          console.error('Error fetching autores IDs:', error);
        },
        complete: () => {
          console.log('Request for autores IDs completed.');
        }
      });
  }

  getAutoresFavoritos(): void {
    this.autoresIds.forEach(id => {
      this.http.get<any>(`https://wattbook.onrender.com/usuario/${id}/perfil`)
        .subscribe({
          next: user => {
            console.log('Fetched autor favorito:', user);
            this.autoresFavoritos.push({
              id: user.id,
              nombre: user.nombre,
              imagen: user.imagen
            });
          },
          error: error => {
            console.error('Error fetching autor favorito:', error);
          },
          complete: () => {
            console.log('Request for autor favorito completed.');
          }
        });
    });
  }

  getSeguidoresId(): void {
    this.http.get<any[]>(`https://wattbook.onrender.com/seguidores/listaSeguidores/${this.idactual}`, { observe: 'response' })
      .subscribe({
        next: response => {
          console.log('Response from /seguidores/listaSeguidores/2:', response);
          if (response.headers.get('content-type')?.includes('application/json')) {
            const body = response.body;
            console.log('Body:', body);
            if (Array.isArray(body)) {
              this.seguidoresId = [...new Set(body)];
              this.getSeguidores();
            } else {
              console.error('Unexpected response format:', body);
            }
          } else {
            console.error('Unexpected content type:', response.headers.get('content-type'));
            console.error('Response text:', response.body);
          }
        },
        error: error => {
          console.error('Error fetching seguidores IDs:', error);
        },
        complete: () => {
          console.log('Request for seguidores IDs completed.');
        }
      });
  }

  getSeguidores(): void {
    this.seguidoresId.forEach(id => {
      if (id !== undefined) {
        this.http.get<any>(`https://wattbook.onrender.com/usuario/${id}/perfil`)
          .subscribe({
            next: response => {
              console.log(`Response from /usuario/${id}/perfil:`, response);
              this.seguidores.push(response);
            },
            error: error => {
              console.error(`Error fetching seguidor ${id} profile:`, error);
            },
            complete: () => {
              console.log(`Request for seguidor ${id} profile completed.`);
            }
          });
      } else {
        console.error('Seguidor ID is undefined');
      }
    });
  }

  toggleFollow(): void {
    if (this.seguidoresId.includes(this.usuarioId)) {
      this.dejarSeguirUsuario();
      this.followText = "Seguir";
      localStorage.setItem(`followState_${this.usuarioId}`, 'false');
      this.seguidoresId = this.seguidoresId.filter(id => id !== this.usuarioId);
    } else {
      this.seguirUsuario();
      this.followText = "Dejar de seguir";
      localStorage.setItem(`followState_${this.usuarioId}`, 'true');
      this.seguidoresId.push(this.usuarioId);
    }
  }

  seguirUsuario(): void {
    const followData = { userId: this.usuarioId, seguidorId: this.idactual };
    const url = `https://wattbook.onrender.com/seguidores/anyadirSeguidor`;

    this.http.post(url, followData)
      .subscribe({
        next: response => {
          console.log('Usuario seguido con éxito:', response);
        },
        error: error => {
          console.error('Error al seguir usuario:', error);
        }
      });
  }

  dejarSeguirUsuario(): void {
    const unfollowData = { userId: this.usuarioId, seguidorId: this.idactual };
    const url = `https://wattbook.onrender.com/seguidores/eliminarSeguidor`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.delete(url, { headers, body: unfollowData })
      .subscribe({
        next: response => {
          console.log('Usuario dejado de seguir con éxito:', response);
        },
        error: error => {
          if (error.status === 403) {
            console.error('Forbidden: Verifique la configuración de CORS y los permisos del usuario.');
          }
        }
      });
  }

  votar(libroId: number, esLike: boolean) {
    const usuarioId = this.obtenerUsuarioId();
    this.libroService.votarlibro(libroId, usuarioId, esLike).pipe(
      finalize(() => {
        console.log('Operación de votar finalizada');
      })
    ).subscribe({
      next: response => {
        console.log('Voto registrado con éxito');
        this.cargarPerfil();
      },
      error: error => {
        console.error('Error al registrar voto', error);
      }
    });
  }
}
