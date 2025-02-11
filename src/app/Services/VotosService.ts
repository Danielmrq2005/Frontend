import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VotosService {
  private apiUrl = 'http://localhost:8081/votos';
  constructor(private http: HttpClient) {}


}
