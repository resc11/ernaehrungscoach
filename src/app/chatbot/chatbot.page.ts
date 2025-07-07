import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage {
  messages: ChatMessage[] = [
    { from: 'bot', text: 'Hallo! Wie kann ich dir helfen?' }
  ];
  currentMessage: string = '';

  sendMessage() {
    const msg = this.currentMessage.trim();
    if (!msg) return;
    this.messages.push({ from: 'user', text: msg });
    this.currentMessage = '';
    setTimeout(() => {
      this.messages.push({ from: 'bot', text: 'Dies ist eine automatische Antwort.' });
    }, 500);
  }
}
