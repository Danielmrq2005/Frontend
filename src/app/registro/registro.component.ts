import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Genero } from './genero.enum';
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    KeyValuePipe
  ]
})
export class RegistroComponent implements OnInit {
  nombre: string = '';
  apellidos: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  genero: Genero | null = null;
  imagen: string = '';
  descripcion: string = '';

  generos = Genero; // Para acceder a los valores del enum en el template

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  async handleRegister() {
    if (this.password !== this.confirmPassword) {
      this.showError('Las contraseñas no coinciden.');
      return;
    }

    const registroData = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      username: this.username,
      email: this.email,
      password: this.password,
      generos: this.genero,
      imagen: this.imagen,
      descripcion: this.descripcion
    };

    console.log('Registro Data:', registroData);

    try {
      const response = await this.http
        .post('http://localhost:8081/auth/registro/perfil', registroData, { observe: 'response' })
        .toPromise();

      if (response?.status === 201) {
        alert('Registro exitoso');
      } else {
        this.showError('Registro fallido');
      }
    } catch (error: any) {
      this.showError(error.error?.mensaje || 'Ocurrió un error');
    }
  }

  private showError(message: string) {
    const container = document.querySelector('.login-container') as HTMLElement;

    if (container) {
      const errorElement = document.createElement('p');
      errorElement.textContent = message;
      errorElement.style.color = 'red';
      container.appendChild(errorElement);
    }
  }
}
