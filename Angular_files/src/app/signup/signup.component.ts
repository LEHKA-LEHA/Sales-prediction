import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  emailInvalid: boolean = false;
  isFormEmpty: boolean = true;
  containerHeight: string = '';
  errorMessage: string = '';



  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.containerHeight = window.innerHeight + 'px';
  }

  formValid(): boolean {
    const isEmailValid: boolean = !this.emailInvalid;
    const isErrorMessageVisible: boolean = this.emailInvalid;
    return isEmailValid && !isErrorMessageVisible;
  }

  checkFormEmpty(): void {
    this.isFormEmpty = !(this.email || this.password);
  }


  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !emailRegex.test(this.email);
  }

  clearEmailError(): void {
    if (this.emailInvalid) {
      this.emailInvalid = false;
    }
  }
  isPasswordValid(): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]\\|;:'",<.>/?]).{8,}$/;
    return passwordRegex.test(this.password);
  }
  signup(): void {



    this.errorMessage = '';

    this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        console.log('Signed up successfully:', userCredential);

        this.router.navigate(['/input']);
      })
      .catch((error) => {
        console.error('Signup error:', error);
        if (error.code === 'auth/email-already-in-use') {
          window.alert('The email already exists. Please use a different email.');
        }
      });
  }
}
