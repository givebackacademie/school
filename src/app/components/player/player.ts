import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-player',
  imports: [Navbar],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player {}
