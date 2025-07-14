import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { v4 as uuidv4, v4 } from 'uuid';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule
  ]
})
export class AppComponent {}


const USER_ID_KEY = 'user_id';

// Beim App-Start prüfen und ggf. generieren
let userId = localStorage.getItem(USER_ID_KEY);
if (!userId) {
  userId = uuidv4();
  localStorage.setItem(USER_ID_KEY, userId);
}