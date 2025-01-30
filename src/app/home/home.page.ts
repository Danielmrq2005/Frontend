import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonThumbnail,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { VotosService } from '../Services/VotosService';
import {LibroService} from "../Services/LibroService";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, HttpClientModule, CommonModule, RouterLink],
  standalone: true,
  providers: [LibroService],
})
export class HomePage {
  librosTop: any[] = [];

  constructor(private libroService: LibroService) {}

  ngOnInit() {
    this.libroService.obtenerTop4Libros().subscribe(data => {
      this.librosTop = data;
    });
  }
}
