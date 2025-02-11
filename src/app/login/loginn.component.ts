import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from '@ionic/angular';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Login} from "../modelos/Login";
import {LoginService} from "../Services/login.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";


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


  constructor(private loginService: LoginService, private router: Router, private fb: FormBuilder, private alertController: AlertController) {
    this.loginForm = this.fb.group({
      username: [this.login.username, Validators.required],
      password: [this.login.password, Validators.required],
    });


  }

  ngOnInit() {
  }

  doLogin(): void {
    if (this.loginForm.valid) {
      this.login = {...this.login, ...this.loginForm.value};
      this.loginService.loguear(this.login).subscribe({
        next: (respuesta) => {
          const token = respuesta.token;
          sessionStorage.setItem("authToken", token);
          this.loginService.setAuthState(true);
          this.router.navigate(['/home']);
        },
        error: async (e) => {
          console.error(e);
          await this.presentAlert('Fallo al iniciar sesion', 'Usuario o contraseña incorrectos');
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
