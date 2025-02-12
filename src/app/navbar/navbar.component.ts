import { Component, OnInit } from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {LibroService} from "../Services/LibroService";
import {UsuarioService} from "../Services/UsuarioService";
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  providers: [LibroService, UsuarioService],
  imports: [
    IonicModule,
    RouterLink
  ]
})
export class NavbarComponent  implements OnInit {
  usuId = this.obtenerUsuarioId();
  esAdmin: boolean = false;

  constructor(private libroService: LibroService, public usuarioService:UsuarioService) {}

  ngOnInit() {
    this.usuarioService.obtenerRolUsuario(this.usuId).subscribe(rol => {
      this.esAdmin = rol === 'ADMIN';
    });
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
