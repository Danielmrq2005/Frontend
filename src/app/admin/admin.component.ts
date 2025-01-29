import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class AdminComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
