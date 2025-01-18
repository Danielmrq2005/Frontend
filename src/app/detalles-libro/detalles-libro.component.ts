import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-detalles-libro',
  templateUrl: './detalles-libro.component.html',
  styleUrls: ['./detalles-libro.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class DetallesLibroComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
