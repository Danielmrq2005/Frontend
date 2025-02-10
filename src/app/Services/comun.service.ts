import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ComunService {


  constructor(private http: HttpClient) {
  }

  autorizarPeticion() {
    const headers:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    });

    return {headers: headers}
  }
}
