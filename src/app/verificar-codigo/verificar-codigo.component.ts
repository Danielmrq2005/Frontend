import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from "../services/login.service";
import { UsuarioService } from "../services/UsuarioService";
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { Verificacion } from "../Models/Verificacion";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VerificarCodigoComponent implements OnInit {

  verificarCodigoForm: FormGroup;
  UsuarioId: number | null = null;
  username: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.verificarCodigoForm = this.fb.group({
      codigoVerificacion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.UsuarioId = this.obtenerUsuarioId();
    console.log('UsuarioId obtenido:', this.UsuarioId);

    if (this.UsuarioId) {
      this.usuarioService.obtenerUsernameMensaje(this.UsuarioId).subscribe({
        next: (nombreUsuario: string) => {
          this.username = nombreUsuario;
          console.log('Username obtenido:', this.username);
        },
        error: (error) => {
          console.error('Error obteniendo el username:', error);
        }
      });
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

  async verificarCodigo() {
    if (this.verificarCodigoForm.valid) {
      if (!this.username) {
        console.error('El username aún no se ha cargado');
        await this.presentAlert('Error', 'No se pudo obtener el usuario. Intenta de nuevo.');
        return;
      }

      const verificacion: Verificacion = {
        username: this.username,
        codigoVerificacion: this.verificarCodigoForm.value.codigoVerificacion
      };

      console.log('Enviando verificación:', verificacion);

      this.usuarioService.verificarCodigo(verificacion).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: async (error) => {
          console.error(error);
          await this.presentAlert('Error', 'Código incorrecto o expirado');
        }
      });
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
