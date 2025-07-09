import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kalender',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './kalender.page.html',
  styleUrls: ['./kalender.page.scss'],
})
export class KalenderPage {}
