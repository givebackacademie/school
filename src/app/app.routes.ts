import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { CourseList } from './components/course-list/course-list';
import { Player } from './components/player/player';
import { Zoom } from './components/zoom/zoom';
import { AuthGuard } from './auth/login/guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Consultant } from './components/consultant/consultant';
import { VideoStream } from './components/videostream/videostream';
import { Getstream } from './components/getstream/getstream';

export const routes: Routes = [
  { path: 'course-list/:id', component: CourseList },
  { path: 'player/:id', component: Player },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'consultancy', component: Consultant, canActivate: [AuthGuard] },
  { path: 'startlive', component: VideoStream, canActivate: [AuthGuard] },
  { path: 'live', component: Zoom, canActivate: [AuthGuard] },
  { path: 'join', component: Getstream },
  { path: '', component: Home },
];
