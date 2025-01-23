import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './loginn.component.html',
  styleUrls: ['./loginn.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    HttpClientModule // Add HttpClientModule here
  ]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  async handleLogin() {
    const loginData = {
      nombreUsuario: this.username,
      contraseña: this.password,
    };

    try {
      const response = await this.http
        .post('http://localhost:8080/auth/login', loginData, { observe: 'response' })
        .toPromise();

      if (response?.status === 200) {
        alert('Login exitoso');
      }
    } catch (error: any) {
      const errorMessage = error.error?.mensaje || 'Ocurrió un error';
      const container = document.querySelector('.login-container') as HTMLElement;

      if (container) {
        const errorElement = document.createElement('p');
        errorElement.textContent = errorMessage;
        errorElement.style.color = 'red';
        container.appendChild(errorElement);
      }
    }
  }
}
