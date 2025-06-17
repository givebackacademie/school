import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth, authState, User } from '@angular/fire/auth';
import { AuthService } from '../../auth-service';
@Component({
  selector: 'app-backnavbar',
  imports: [FontAwesomeModule],
  templateUrl: './back-navbar.html',
  styleUrl: './back-navbar.scss',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class BackNavbar {
  user$: Observable<User | null>;

  signout() {
    this.authService.logout();
  }
  private canGoBack: boolean;
  user;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private auth: Auth,
    private authService: AuthService,
  ) {
    this.user$ = authState(this.auth);
    this.user = this.auth.currentUser;
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }

  faCoffee = faCoffee;
  faHome = faHome;
  faEnvelope = faEnvelope;
  faUserAlt = faUserAlt;
  faShieldAlt = faShieldAlt;
  faAngleDown = faAngleDown;
  faArrowLeft = faArrowLeft;
  @ViewChild('navBurger')
  navBurger!: ElementRef;
  @ViewChild('navMenu')
  navMenu!: ElementRef;
  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  goBack(): void {
    if (this.canGoBack) {
      // We can safely go back to the previous location as
      // we know it's within our app.
      this.location.back();
    } else {
      // There's no previous navigation.
      // Here we decide where to go. For example, let's say the
      // upper level is the index page, so we go up one level.
      this.router.navigate(['/'], { relativeTo: this.route });
    }
  }
}
