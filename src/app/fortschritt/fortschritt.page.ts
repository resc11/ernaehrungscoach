import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-fortschritt',
  templateUrl: './fortschritt.page.html',
  styleUrls: ['./fortschritt.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FortschrittPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
