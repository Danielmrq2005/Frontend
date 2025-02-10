import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Login} from "../modelos/Login";
import {LoginService} from "../Services/login.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
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


  constructor(private loginService: LoginService, private router: Router, private fb: FormBuilder) {
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
  }

   doLogin(): void {

    if (this.loginForm.valid) {
      this.login = {...this.login, ...this.loginForm.value};
      this.loginService.loguear(this.login).subscribe({
        next: (respuesta) => {
          const token = respuesta.token;
          sessionStorage.setItem("authToken", token);

          this.loginService.setAuthState(true);

        },
        error: (e) => console.error(e),
        complete: () => this.router.navigate(['/home'])
      })


    } else {
      console.log('Formulario inválido. Por favor verifica los datos.');
    }
  }

}
