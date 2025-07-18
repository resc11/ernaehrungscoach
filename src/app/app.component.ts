import { Component, OnInit } from '@angular/core'; // OnInit importieren
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
export class AppComponent implements OnInit { // OnInit implementieren
  constructor(private router: Router, private http: HttpClient) {}

  /**
   * Setzt die Backend-Session für den aktuellen Benutzer zurück.
   * Dies wird aufgerufen, wenn die App neu geladen wird und eine User-ID vorhanden ist,
   * um den Backend-Zustand mit dem geleerten Frontend-Chat zu synchronisieren.
   */
  resetSession() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.post('http://localhost:5000/api/reset_session', { user_id: userId })
        .subscribe({
          next: (res) => {
            console.log('Backend-Session erfolgreich zurückgesetzt:', res);
            // Der Frontend-Chat wird durch den Browser-Refresh bereits geleert.
            // Keine weitere DOM-Manipulation hier notwendig.
          },
          error: (err) => {
            console.error('Fehler beim Zurücksetzen der Backend-Session:', err);
            // Fehlerbehandlung, z.B. eine Meldung an den Benutzer
          }
        });
    }
  }

  /**
   * Meldet den Benutzer ab und löscht die Session sowohl im Frontend als auch im Backend.
   */
  logout() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // API-Aufruf zum Löschen der Session auf dem Server
      this.http.post('http://localhost:5000/api/logout', { user_id: userId })
        .subscribe({
          next: (res) => {
            console.log('Erfolgreich abgemeldet:', res);
            localStorage.removeItem('user_id');  // Lösche user_id aus dem localStorage
            this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite
          },
          error: (err) => {
            console.error('Fehler beim Abmelden:', err);
            // Falls es beim Logout einen Fehler gibt, trotzdem zur Login-Seite weiterleiten
            this.router.navigate(['/login']);
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Lebenszyklus-Hook, der beim Initialisieren der Komponente aufgerufen wird.
   * Prüft den Anmeldestatus und setzt ggf. die Backend-Session zurück.
   */
  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      // Wenn keine user_id im localStorage ist, zur Login-Seite navigieren
      this.router.navigate(['/login']);
    } else {
      // Wenn eine user_id vorhanden ist (d.h. der Benutzer war angemeldet und hat evtl. aktualisiert),
      // die Backend-Session zurücksetzen, um den Zustand des Frontends (geleerter Chat) zu spiegeln.
      this.resetSession();
    }
  }
}
