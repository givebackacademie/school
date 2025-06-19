import { Component, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth-service';
import { BackNavbar } from '../../components/back-navbar/back-navbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-signup',
  templateUrl: './register.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    RouterLink,
    BackNavbar,
    FontAwesomeModule,
    NgxIntlTelInputModule,
  ],
})
export class Register {
  envelop = faEnvelope;
  lopckOpen = faLock;
  faUser = faUser;
  person = faUserAlt;
  signupForm: FormGroup;
  errorMessage = signal('');
  errorMessageEmail = signal('');
  deviceInfo: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceDetectorService,
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
    });
  }

  ngOnInit() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo);
  }
  async onSignUp() {
    if (this.signupForm.valid) {
      try {
        this.loading.set(true);

        await this.authService.signUp(
          this.signupForm.value.email.trim(),
          this.signupForm.value.password.trim(),
          this.signupForm.value.firstName.trim(),
          this.signupForm.value.lastName.trim(),
          this.signupForm.value.phone.e164Number,
          this.signupForm.value.gender,
          this.deviceInfo.device,
        );
        this.loading.set(false);
        this.router.navigate(['/']); // Redirect on success
      } catch (error: any) {
        this.loading.set(false);
        console.log(error.message);
        if (error.message.includes('auth/email-already-in-use')) {
          this.errorMessageEmail.set('Email Address Already in-use');
          // console.log('Email Address Already in-use');
        }
        //
        // || 'Sign-up failed. Please try again.'
      }
    } else {
      this.errorMessage.set('Please fill the form Properly');
    }
  }
}
