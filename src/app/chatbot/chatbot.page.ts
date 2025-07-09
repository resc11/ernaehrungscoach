import { Component, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

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
    HttpClientModule,
    MarkdownModule
  ],
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements AfterViewInit, AfterViewChecked {
  messages: ChatMessage[] = [
    { from: 'bot', text: `Willkommen beim Ernährungscoach!
      
Ich helfe dir Mahlzeiten zu erfassen, Ziele zu setzen und deinen Fortschritt zu verfolgen.

Was kann ich für dich tun?` }
  ];
  currentMessage: string = '';
  isLoading: boolean = false;

  @ViewChild('chatHistory') chatHistory!: ElementRef<HTMLDivElement>;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage() {
    const msg = this.currentMessage.trim();
    if (!msg) return;

    // User-Nachricht anzeigen
    this.messages.push({ from: 'user', text: msg });
    this.currentMessage = '';
    this.isLoading = true;

    // Anfrage an das Flask-Backend
    this.http.post<{ response: string }>(
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
