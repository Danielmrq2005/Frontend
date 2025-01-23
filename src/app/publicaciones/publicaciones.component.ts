import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {add} from "ionicons/icons";
import {addIcons} from "ionicons";

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class PublicacionesComponent  implements OnInit {

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {}

}
