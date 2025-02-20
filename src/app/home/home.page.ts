import { Component } from '@angular/core';
import {LibroService} from "../services/LibroService";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {Router, RouterLink} from "@angular/router";
import {UsuarioService} from "../services/UsuarioService";
import {jwtDecode} from "jwt-decode";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, NavbarComponent],
  standalone: true,
  providers: [LibroService],
})
export class HomePage {
  librosTop: any[] = [];

  usuId = this.obtenerUsuarioId();
  esAdmin: boolean = false;


  constructor(private libroService: LibroService, public usuarioService:UsuarioService,private router : Router) {}

  ngOnInit() {
    this.libroService.obtenerTop4Libros().subscribe(data => {
      this.librosTop = data;
    });
    this.usuarioService.obtenerRolUsuario(this.usuId).subscribe(rol => {
      this.esAdmin = rol === 'ADMIN';
    });
  }
  verDetallesLibro(libroId: number) {
    this.router.navigate(['detallesLibro', libroId]);
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

}
