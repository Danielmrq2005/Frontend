import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from "@ionic/angular";
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroService } from "../services/registro.service";
import { CommonModule } from "@angular/common";
import { Registro } from "../Models/Registro";
import { Router } from "@angular/router";
import { Genero } from "../Models/Genero";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [RegistroService]
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  registro: Registro = new Registro();
  generos: Genero = Genero.BIOGRAFICO;
  loginViewFlag: boolean = true;

  generosArray = Object.values(Genero);

  constructor(private registroService: RegistroService, private fb: FormBuilder, private router: Router, private alertController: AlertController) {
    this.registroForm = this.fb.group({
      nombre: [this.registro.nombre, Validators.required],
      apellidos: [this.registro.apellidos, Validators.required],
      username: [this.registro.username, Validators.required],
      email: [this.registro.email, [Validators.required, Validators.email]],
      password: [this.registro.password, Validators.required],
      genero: [this.registro.generos, Validators.required],
      imagen: [this.registro.imagen, Validators.required],
      descripcion: [this.registro.descripcion, Validators.required],
    });
  }

  ngOnInit() {}

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  doRegister() {
    if (this.registroForm.valid) {
      this.registro = { ...this.registro, ...this.registroForm.value };
      this.registro.generos = this.registroForm.value.genero;

      console.log("Datos enviados:", this.registro);

      this.registroService.registrar(this.registro).subscribe({
        next: () => {
          console.info("Registro exitoso");
          this.router.navigate(['login']);
        },
        error: (e: any) => {
          if (e.status === 409) {
            this.showAlert('Error', 'El email o username ya existe.');
          } else {
            this.showAlert('Exito', 'Usuario creado con exito.');
            this.router.navigate(['login']);
          }
        },
      });
    } else {
      this.showAlert('Formulario inválido', 'Por favor, verifica los datos.');
    }
  }
}

