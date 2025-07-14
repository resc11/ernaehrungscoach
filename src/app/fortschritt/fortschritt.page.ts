import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { MealHistoryService } from '../services/meal-history.service'; // ggf. Pfad anpassen

@Component({
  selector: 'app-fortschritt',
  standalone: true,
  imports: [IonicModule, CommonModule, BaseChartDirective],
  templateUrl: './fortschritt.page.html',
  styleUrls: ['./fortschritt.page.scss'],
})
export class FortschrittPage implements OnInit {
  caloriesChartData: any;
  macroChartData: any;
  waterChartData: any;

  caloriesChartOptions: any;
  macroChartOptions: any;
  waterChartOptions: any;

  labels: string[] = [];

  constructor(private mealHistoryService: MealHistoryService) {}

  ngOnInit() {
    this.fetchMealHistory();
    this.initChartOptions();
  }

  fetchMealHistory() {
    this.mealHistoryService.getMealHistory(7).subscribe(history => {
      this.labels = history.map(entry => entry.date);

      // Zielwerte für alle Tage fallbacken, falls irgendwo Lücken sind:
      const caloriesGoalDefault = history[0]?.goal?.calories ?? 2000;
      const proteinGoalDefault  = history[0]?.goal?.protein  ?? 80;
      const carbsGoalDefault    = history[0]?.goal?.carbs    ?? 250;
      const fatGoalDefault      = history[0]?.goal?.fat      ?? 70;
      const waterGoalDefault    = history[0]?.goal?.water    ?? 2000;

      const calories     = history.map(entry => entry.sum.calories);
      const caloriesGoal = history.map(entry => entry.goal?.calories ?? caloriesGoalDefault);

      const protein      = history.map(entry => entry.sum.protein);
      const proteinGoal  = history.map(entry => entry.goal?.protein ?? proteinGoalDefault);

      const carbs        = history.map(entry => entry.sum.carbs);
      const carbsGoal    = history.map(entry => entry.goal?.carbs ?? carbsGoalDefault);

      const fat          = history.map(entry => entry.sum.fat);
      const fatGoal      = history.map(entry => entry.goal?.fat ?? fatGoalDefault);

      const water        = history.map(entry => entry.sum.water);
      const waterGoal    = history.map(entry => entry.goal?.water ?? waterGoalDefault);

      // Debug-Check für Zielwerte
      console.log('proteinGoal', proteinGoal);
      console.log('carbsGoal', carbsGoal);
      console.log('fatGoal', fatGoal);

      // Kalorien-Chart
      this.caloriesChartData = {
        labels: this.labels,
        datasets: [
          {
            label: 'Kalorien',
            data: calories,
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54,162,235,0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: 'Kalorien-Ziel',
            data: caloriesGoal,
            borderColor: '#eb4034',
            borderDash: [6, 4],
            fill: false,
            pointRadius: 0
          }
        ]
      };

      // Makronährstoff-Chart (Bars & Linien, Ziele durchgehend)
      this.macroChartData = {
        labels: this.labels,
        datasets: [
          // Balken
          {
            label: 'Protein',
            data: protein,
            backgroundColor: '#4bc0c0',
            borderWidth: 1,
            type: 'bar',
          },
          {
            label: 'Kohlenhydrate',
            data: carbs,
            backgroundColor: '#ffcd56',
            borderWidth: 1,
            type: 'bar',
          },
          {
            label: 'Fett',
            data: fat,
            backgroundColor: '#ff6384',
            borderWidth: 1,
            type: 'bar',
          },
          // Ziel-Linien
          {
            label: 'Protein-Ziel',
            data: proteinGoal,
            borderColor: '#4bc0c0',
            borderDash: [6,3],
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderWidth: 2,
            order: 1,
            spanGaps: true,
            clip: false
          },
          {
            label: 'Kohlenhydrate-Ziel',
            data: carbsGoal,
            borderColor: '#ffcd56',
            borderDash: [6,3],
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderWidth: 2,
            order: 1,
            spanGaps: true,
            clip: false
          },
          {
            label: 'Fett-Ziel',
            data: fatGoal,
            borderColor: '#ff6384',
            borderDash: [6, 3],
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderWidth: 2,
            order: 1,
            spanGaps: true,
            clip: false
          }
        ]
      };

      // Wasser-Chart
      this.waterChartData = {
        labels: this.labels,
        datasets: [
          {
            label: 'Wasser (ml)',
            data: water,
            borderColor: '#0077b6',
            backgroundColor: 'rgba(0,119,182,0.13)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: 'Wasser-Ziel (ml)',
            data: waterGoal,
            borderColor: '#0cc274',
            borderDash: [6,4],
            fill: false,
            pointRadius: 0
          }
        ]
      };
    });
  }

  initChartOptions() {
    this.caloriesChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 2500 }
      }
    };
    this.macroChartOptions = {
      responsive: true,
      plugins: { legend: { display: true, position: 'top' } },
      scales: {
        y: { beginAtZero: true, suggestedMax: 400, stacked: false }
      }
    };
    this.waterChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 2500 }
      }
    };
  }
}
