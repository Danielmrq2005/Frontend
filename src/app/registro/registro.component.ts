import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class RegistroComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
