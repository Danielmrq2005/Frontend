import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})

export class ChatUsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  



}
