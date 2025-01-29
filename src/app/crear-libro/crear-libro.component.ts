import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-crear-libro',
  templateUrl: './crear-libro.component.html',
  styleUrls: ['./crear-libro.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class CrearLibroComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
