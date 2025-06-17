import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { CourseList } from './components/course-list/course-list';
import { Player } from './components/player/player';
import { Zoom } from './components/zoom/zoom';
import { AuthGuard } from './auth/login/guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [
  { path: 'course-list/:id', component: CourseList },
  { path: 'player/:id', component: Player },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'live', component: Zoom, canActivate: [AuthGuard] },
  { path: '', component: Home },
];
