import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formError: string = '';
  submitted = false;

  credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: Authentication
  ) {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password ||
          !this.credentials.name) {
      this.formError = 'All fields are required, please try again';
      this.router.navigateByUrl('#'); // Return to login page
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    const newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    // console.log('Login::doLogin');
    // console.log(this.credentials);
    this.authenticationService.login(newUser, this.credentials.password).subscribe();

    if (this.authenticationService.isLoggedIn()) {
      // console.log('Router::Direct');
      this.router.navigate(['']);
    } else {
      // Login is asynchronous - wait a moment and check again
      setTimeout(() => {
        if (this.authenticationService.isLoggedIn()) {
          // console.log('Router::Pause');
          this.router.navigate(['']);
        }
      }, 3000);
    }
  }
}
