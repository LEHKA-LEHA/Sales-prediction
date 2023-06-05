import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  emailInvalid: boolean = false;
  isFormEmpty: boolean = true;
  isLoginDisabled: boolean = true;
  containerHeight: string = '';
  errorMessage: string = ''; 

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    this.containerHeight = window.innerHeight + 'px';
    this.updateLoginButtonState();
  }

  checkFormEmpty(): void {
    this.isFormEmpty = !(this.email && this.password);
    this.updateLoginButtonState();
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !emailRegex.test(this.email);
    this.updateLoginButtonState();
  }

  clearEmailError(): void {
    if (this.emailInvalid) {
      this.emailInvalid = false;
      this.updateLoginButtonState();
    }
  }

  updateLoginButtonState(): void {
    this.isLoginDisabled = this.isFormEmpty || this.emailInvalid || !this.password;
  }

  login(): void {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        console.log('Logged in successfully:', userCredential);
        this.router.navigate(['/input']); 
      })
      .catch((error) => {
        console.error('Login error:', error);
        window.alert('Invalid email or password');

      });
  }
}
