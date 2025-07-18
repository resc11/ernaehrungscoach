import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  username = '';
  password = '';
  isLoading = false;
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
  this.isLoading = true;
  this.errorMsg = '';
  this.http.post<{ success: boolean; user_id?: string; message?: string }>(
    'http://localhost:5000/api/login',
    { username: this.username, password: this.password }
  ).subscribe({
    next: (res) => {
      if (res.success && res.user_id) {
        // Überprüfen und Präfix entfernen, falls vorhanden
        let userId = res.user_id;
        if (userId.startsWith('user_')) {
          userId = userId.substring(5);  // Entferne "user_" Präfix
        }

        // Speichern der Benutzer-ID im LocalStorage
        localStorage.setItem('user_id', userId);
        this.router.navigate(['/chatbot']);
      } else {
        this.errorMsg = res.message || 'Login fehlgeschlagen.';
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMsg = 'Serverfehler. Bitte versuche es erneut.';
      this.isLoading = false;
    }
  }); }
}
