import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http'; // Import HttpClientModule and HttpClient
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

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  async handleLogin() {
    const loginData = {
      username: this.username,
      password: this.password,
    };

    console.log('Login Data:', loginData);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    try {
      const response = await this.http
        .post('http://localhost:8081/auth/login', loginData, {headers: headers, observe: 'response'})
        .toPromise();

      if (response?.status === 200) {
        alert('Login exitoso');
      } else {
        this.showError('Login fallido');
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
