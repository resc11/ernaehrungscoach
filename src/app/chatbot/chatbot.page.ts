import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage {
  messages: ChatMessage[] = [
    { from: 'bot', text: 'Hallo! Wie kann ich dir helfen?' }
  ];
  currentMessage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    const msg = this.currentMessage.trim();
    if (!msg) return;

    // User-Nachricht anzeigen
    this.messages.push({ from: 'user', text: msg });
    this.currentMessage = '';
    this.isLoading = true;

    // Anfrage an das Flask-Backend
    this.http.post<{response: string}>(
      'http://localhost:5000/chat',        // URL ggf. anpassen
      { message: msg, user_id: 'frontend-demo' }
    ).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.response });
        this.isLoading = false;
      },
      error: (err) => {
        this.messages.push({ from: 'bot', text: 'Serverfehler. Bitte versuche es später erneut.' });
        this.isLoading = false;
      }
    });
  }
}
