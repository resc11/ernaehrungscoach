import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chatbot',
    loadChildren: () => import('./chatbot/chatbot.routes').then(m => m.default)
  },
  {
    path: 'fortschritt',
    loadChildren: () => import('./fortschritt/fortschritt.routes').then(m => m.default)
  },
  {
    path: 'ernaehrungsplaene',
    loadChildren: () => import('./ernaehrungsplaene/ernaehrungsplaene.routes').then(m => m.default)
  },
  {
    path: 'kalender',
    loadChildren: () => import('./kalender/kalender.routes').then(m => m.default)
  },
  {
    path: '',
    redirectTo: '/chatbot',
    pathMatch: 'full'
  }
];
