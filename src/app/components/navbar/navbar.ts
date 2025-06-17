import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth-service';
@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  user$: Observable<User | null>;
  user;
  constructor(
    private auth: Auth,
    private authService: AuthService,
  ) {
    this.user$ = authState(this.auth);
    this.user = this.auth.currentUser;
  }

  signout() {
    this.authService.logout();
  }
  faCoffee = faCoffee;
  faHome = faHome;
  faEnvelope = faEnvelope;
  faUserAlt = faUserAlt;
  faShieldAlt = faShieldAlt;
  faAngleDown = faAngleDown;
  @ViewChild('navBurger')
  navBurger!: ElementRef;
  @ViewChild('navMenu')
  navMenu!: ElementRef;
  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }
}
