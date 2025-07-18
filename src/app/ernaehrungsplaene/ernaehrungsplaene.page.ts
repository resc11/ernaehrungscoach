import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealplanService } from '../services/mealplan.services';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ernaehrungsplaene',
  templateUrl: './ernaehrungsplaene.page.html',
  styleUrls: ['./ernaehrungsplaene.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ErnaehrungsplaenePage implements OnInit {
  plan: any = null;
  loading = true;
  error = '';

  mealNames: { [key: string]: string } = {
    fruehstueck: 'Frühstück',
    mittagessen: 'Mittagessen',
    abendessen: 'Abendessen',
    snack: 'Snack'
  };

  constructor(
    private mealplanService: MealplanService,
    private router: Router
  ) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.mealplanService.getMealplan().subscribe({
      next: res => {
        this.plan = res;
        console.log('Geladener Plan:', this.plan);

        this.loading = false;
      },
      error: () => {
        this.error = 'Fehler beim Laden des Ernährungsplans.';
        this.loading = false;
      }
    });
  }

  // Hilfsfunktion für besser lesbare Zutatenlisten
  zutatenStr(zutaten: any[]): string {
    if (!Array.isArray(zutaten)) return '';
    return zutaten.map(z => `${z.menge} ${z.name}`).join(', ');
  }
}
