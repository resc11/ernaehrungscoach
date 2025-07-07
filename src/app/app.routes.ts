import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'chatbot', pathMatch: 'full' },
  { path: 'chatbot', loadChildren: () => import('./chatbot/chatbot.routes').then(m => m.routes) },
  { path: 'fortschritt', loadChildren: () => import('./fortschritt/fortschritt.routes').then(m => m.routes) },
  { path: 'ernaehrungsplaene', loadChildren: () => import('./ernaehrungsplaene/ernaehrungsplaene.routes').then(m => m.routes) }
];
