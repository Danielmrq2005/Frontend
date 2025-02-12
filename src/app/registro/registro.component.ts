import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule } from "@ionic/angular";
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genero } from './genero.enum';
import { RegistroService } from "../Services/registro.service";
import { CommonModule, KeyValuePipe } from "@angular/common";
import { Registro } from "../modelos/Registro";
import { Router } from "@angular/router";
import { i5Genero } from "../Models/Genero";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    KeyValuePipe,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [RegistroService]
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  registro: Registro = new Registro();
  generos = Object.values(Genero);
  loginViewFlag: boolean = true;
  generosArray = Object.values(i5Genero);

  constructor(private registroService: RegistroService, private fb: FormBuilder, private router: Router,private alertController: AlertController) {
    this.registroForm = this.fb.group({
      nombre: [this.registro.nombre, Validators.required],
      apellidos: [this.registro.apellidos, Validators.required],
      username: [this.registro.username, Validators.required],
      email: [this.registro.email, [Validators.required, Validators.email]],
      password: [this.registro.password, Validators.required],
      genero: [this.registro.genero, Validators.required],
      imagen: [this.registro.imagen, Validators.required],
      descripcion: [this.registro.descripcion, Validators.required],
    });
  }

  ngOnInit() {}

  doRegister() {
    if (this.registroForm.valid) {
      this.registro = { ...this.registro, ...this.registroForm.value };
      this.registroService.registrar(this.registro).subscribe({
        next: (respuesta) => {
          this.presentAlert('Exito', 'Usuario registrado correctamente');
        },
        error: (e) => {console.error(e)
        this.presentAlert('Fallo al registrarse', 'Revise los datos introducidos');
        },
        complete: () => this.router.navigate(['login'])
      });
    } else {
      this.presentAlert('Formulario inválido', 'Debes rellenar todos los campos y comprobar que sean correctos');}
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
