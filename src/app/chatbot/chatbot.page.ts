import { Component, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

interface Intent {
  label: string;
  value: string;
  icon?: string;   // icon ist jetzt optional
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
export class ChatbotPage implements OnInit, AfterViewInit, AfterViewChecked {
  messages: ChatMessage[] = [
    {
      from: 'bot',
      text: `Willkommen beim Ernährungscoach!

Ich helfe dir Mahlzeiten zu erfassen, Ziele zu setzen und deinen Fortschritt zu verfolgen.

Was kann ich für dich tun?`
    }
  ];
  currentMessage: string = '';
  isLoading: boolean = false;
  intents: Intent[] = [];

  @ViewChild('chatHistory') chatHistory!: ElementRef<HTMLDivElement>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Intent[]>('http://localhost:5000/api/intents')
      .subscribe({
        next: (intents) => this.intents = intents,
        error: (err) => {
          this.intents = [];
          console.error('Fehler beim Laden der Intents:', err);
        }
      });
  }

  onIntent(intent: Intent) {
    this.messages.push({ from: 'user', text: intent.label });
    this.isLoading = true;
    this.http.post<{ response: string }>(
      'http://localhost:5000/chat',
      { message: intent.value, user_id: 'frontend-demo' }
    ).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.response });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.messages.push({ from: 'bot', text: 'Serverfehler. Bitte versuche es später erneut.' });
        this.isLoading = false;
        this.scrollToBottom();
        console.error('Chatbot-Intent Fehler:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
  if (this.chatHistory) {
    this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight || 0;
  }
}


  sendMessage() {
    const msg = this.currentMessage.trim();
    if (!msg) { return; }

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = 'u_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', userId);
    }

    this.messages.push({ from: 'user', text: msg });
    this.currentMessage = '';
    this.isLoading = true;

    this.http.post<{ response: string }>(
      'http://localhost:5000/chat',
      { message: msg, user_id: userId }
    ).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.response });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.messages.push({ from: 'bot', text: 'Serverfehler. Bitte versuche es später erneut.' });
        this.isLoading = false;
        this.scrollToBottom();
        console.error('Chatbot-Fehler:', err);
      }
    });
  }
}
