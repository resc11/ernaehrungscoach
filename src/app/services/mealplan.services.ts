import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MealplanService {
  constructor(private http: HttpClient) {}
getMealplan(): Observable<any> {
  const userId = localStorage.getItem('user_id');
  return this.http.get('http://localhost:5000/mealplan?user_id=' + userId);
}
} 