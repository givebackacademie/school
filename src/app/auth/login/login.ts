import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { BackNavbar } from '../../components/back-navbar/back-navbar';
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FontAwesomeModule, BackNavbar],
})
export class Login {
  envelop = faEnvelope;
  lopckOpen = faLock;
  loginForm: FormGroup;
  errorMessage = signal('');
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      try {
        await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
        this.loading.set(false);
      } catch (error) {
        this.loading.set(false);
        this.errorMessage.set('Invalid email or password.');
      }
    }
  }
}
