import { Routes } from '@angular/router';
import {Home} from './Pages/home/home';
import {Room} from './Pages/room/room';
import {Vote} from './Pages/vote/vote';
import {Results} from './Pages/results/results';

export const routes: Routes = [
  { path: '', component:Home },
  { path: 'party/:roomCode', component: Room },
  { path: 'party/:roomCode/vote', component: Vote },
  { path: 'party/:roomCode/results', component: Results }
];
