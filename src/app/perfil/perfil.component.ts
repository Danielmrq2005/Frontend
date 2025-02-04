import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    NgStyle
  ]
})
export class PerfilComponent  implements OnInit {
  followText: string = "Seguir";

  toggleFollow() {
    this.followText = this.followText === "Seguir" ? "No seguir" : "Seguir";
  }


  constructor() { }

  ngOnInit() {}

}
