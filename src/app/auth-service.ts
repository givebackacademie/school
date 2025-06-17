import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  updateProfile,
} from '@angular/fire/auth';
// import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
  ) {}

  // Sign up with email/password
  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    gender: string,
    deviceInfo: string,
  ) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = result.user;

      if (user) {
        // 🔄 Update the display name
        await updateProfile(user, { displayName: firstName });
        // console.log('Display name updated to:', displayName);
        const usersRef = collection(this.firestore, 'users');
        await addDoc(usersRef, {
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          phone: phone,
          gender: gender,
          deviceInfo: deviceInfo,
          // 'opayAccount': opayAccount,
          uid: user.uid,

          lastVisit: Timestamp.now(),
          registeredDate: Timestamp.now(),
          age: 'children',
          status: 'student',
        });
      }

      // return user;
      console.log(result);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // Login with email/password
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // Check authentication state
  getAuthState(): Observable<any> {
    return authState(this.auth);
  }
}
