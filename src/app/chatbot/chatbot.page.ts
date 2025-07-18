import { Component, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { Router } from '@angular/router';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

interface Intent {
  label: string;
  value: string;
  icon?: string;
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

  constructor(private http: HttpClient, private router: Router) {
    // Auth-Check: Redirect zu Login falls nicht eingeloggt
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.router.navigate(['/login']);
    }
  }

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

    // Immer user_id aus localStorage holen!
    const userId = localStorage.getItem('user_id');
    console.log('user_id vor Anfrage:', userId); // Debugging-Ausgabe

    if (!userId) {
      console.error('user_id fehlt, Umleitung zum Login');
      this.router.navigate(['/login']);
      return;
    }

    this.http.post<{ response: string }>(
      'http://localhost:5000/chat',
      { message: intent.value, user_id: userId }
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

  const userId = localStorage.getItem('user_id');  // Sicherstellen, dass user_id geladen wird
  if (!userId) {
    console.error('user_id fehlt, Umleitung zum Login');
    this.router.navigate(['/login']);
    return;
  }

  this.messages.push({ from: 'user', text: msg });
  this.currentMessage = '';
  this.isLoading = true;

  // Sende die Nachricht und die user_id
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
  }); }
} 
