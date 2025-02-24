import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from '@ionic/angular';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Login} from "../Models/Login";
import {LoginService} from "../services/login.service";
import {UsuarioService} from "../services/UsuarioService";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {addIcons} from "ionicons";
import {
  personOutline, keyOutline, textOutline, mailOutline,
  idCard, idCardOutline, text, personCircle, personCircleOutline
} from "ionicons/icons";


@Component({
  selector: 'app-login',
  templateUrl: './loginn.component.html',
  styleUrls: ['./loginn.component.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, FormsModule, ReactiveFormsModule,HttpClientModule
  ],
  providers:[LoginService]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  login: Login = new Login();
  loginForm: FormGroup;
  loginViewFlag: boolean = true;
  Verificado: Observable<boolean> = new Observable<boolean>();
  idusuario: number = 0;


  constructor(private loginService: LoginService, private router: Router, private fb: FormBuilder, private alertController: AlertController, private usuarioService: UsuarioService) {
    this.loginForm = this.fb.group({
      username: [this.login.username, Validators.required],
      password: [this.login.password, Validators.required],
    });

    addIcons({
      personOutline, keyOutline, textOutline, mailOutline,
      idCard, idCardOutline, text, personCircle, personCircleOutline
    });
  }

  ngOnInit() {
    this.Verificado = this.usuarioService.comprobarverificado(this.idusuario)
    this.idusuario = this.obtenerUsuarioId();
  }


  // @ts-ignore
  obtenerUsuarioId(): number{
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

  doLogin(): void {
    if (this.loginForm.valid) {
      this.login = {...this.login, ...this.loginForm.value};

      this.loginService.loguear(this.login).subscribe({
        next: (respuesta) => {
          const token = respuesta.token;
          sessionStorage.setItem("authToken", token);
          this.loginService.setAuthState(true);

          this.idusuario = this.obtenerUsuarioId();
          console.log('Usuario logueado (ID):', this.idusuario);

          this.usuarioService.comprobarverificado(this.idusuario).subscribe({
            next: (verificado) => {
              if (verificado) {
                console.log('Usuario verificado');
                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/publicaciones']);
              }
            },
            error: (err) => {
              console.error("Error al comprobar verificación", err);
            }
          });
        },
        error: async (e) => {
          console.error(e);
          await this.presentAlert('Fallo al iniciar sesión', 'Usuario o contraseña incorrectos');
        }
      });
    } else {
      this.presentAlert('Formulario inválido', 'Debes introducir usuario y contraseña.');
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
