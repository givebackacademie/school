import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth-service';
import { BackNavbar } from '../../components/back-navbar/back-navbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-signup',
  templateUrl: './register.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BackNavbar, FontAwesomeModule],
})
export class Register {
  envelop = faEnvelope;
  lopckOpen = faLock;
  signupForm: FormGroup;
  errorMessage: string = '';
  deviceInfo: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceDetectorService,
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo);
  }
  async onSignUp() {
    if (this.signupForm.valid) {
      try {
        await this.authService.signUp(
          this.signupForm.value.email,
          this.signupForm.value.password,
          this.signupForm.value.firstName,
          this.signupForm.value.lastName,
          this.signupForm.value.phone,
          this.signupForm.value.gender,
          this.deviceInfo.device,
        );
        this.router.navigate(['/']); // Redirect on success
      } catch (error: any) {
        this.errorMessage = error.message || 'Sign-up failed. Please try again.';
      }
    }
  }
}
