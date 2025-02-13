import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class ChatsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
