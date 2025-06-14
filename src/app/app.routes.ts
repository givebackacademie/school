import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { CourseList } from './components/course-list/course-list';
import { Player } from './components/player/player';
import { Zoom } from './components/zoom/zoom';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'course-list/:id', component: CourseList },
  { path: 'player/:id', component: Player },
  { path: 'live', component: Zoom },
];
