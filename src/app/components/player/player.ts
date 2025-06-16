import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { BackNavbar } from '../back-navbar/back-navbar';

@Component({
  selector: 'app-player',
  imports: [BackNavbar],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player {}
