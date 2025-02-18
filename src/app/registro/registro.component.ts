import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule } from "@ionic/angular";
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroService } from "../services/registro.service";
import { CommonModule, KeyValuePipe } from "@angular/common";
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

  constructor(private registroService: RegistroService, private fb: FormBuilder, private router: Router,private alertController: AlertController) {
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

  doRegister() {
    if (this.registroForm.valid) {
      this.registro = { ...this.registro, ...this.registroForm.value };

      this.registro.generos = this.registroForm.value.genero;

      console.log("Datos enviados:", this.registro);

      this.registroService.registrar(this.registro).subscribe({
        next: () => console.info("Registro exitoso"),
        error: (e: any) => console.error("Error en el registro:", e),
        complete: () => this.router.navigate(['login'])
      });
    } else {
      console.log('Formulario inválido. Por favor, verifica los datos.');
    }
  }
}
