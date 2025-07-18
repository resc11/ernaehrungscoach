import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { of } from 'rxjs';  // 'of' für die Fehlerbehandlung

@Injectable({
  providedIn: 'root'
})
export class MealHistoryService {
  private apiUrl = 'http://localhost:5000/api/meal_history';

  constructor(private http: HttpClient) { }

  getMealHistory(days: number = 7): Observable<any[]> {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      // Falls keine user_id im LocalStorage vorhanden ist, gibt es einen Fehler
      return of([]);  // Oder ein Fehler-Objekt zurückgeben
    }

    return this.http.get<any[]>(`${this.apiUrl}?user_id=${userId}&days=${days}`).pipe(
      catchError(error => {
        console.error('Fehler beim Abrufen der Mahlzeitengeschichte', error);
        return of([]);  // Leere Antwort bei Fehler
      })
    );
  }
}
