import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Carousel } from '../carousel/carousel';
import { Livestream } from '../livestream/livestream';
import { CourseComponent } from '../course/course';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [Navbar, Carousel, Livestream, CourseComponent, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
