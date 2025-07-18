import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kalender',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './kalender.page.html',
  styleUrls: ['./kalender.page.scss'],
})
export class KalenderPage {
  constructor(private router: Router) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.router.navigate(['/login']);
    }
  }
}
