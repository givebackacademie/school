import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  canActivate() {
    if (isPlatformBrowser(this.platformId)) {
    }
    return this.authService.getAuthState().pipe(
      map((user) => {
        if (!user) {
          if (isPlatformBrowser(this.platformId)) {
            this.router.navigate(['/login']);
            return false;
          }
        }
        if (isPlatformBrowser(this.platformId)) {
        }
        return true;
      }),
    );
  }
}
