import { Component, ElementRef, HostListener, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModal, AuthModalMode } from '../services/auth-modal';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-auth-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
})
export class AuthModalComponent {
  formError = '';
  submitting = false;

  credentials = this.emptyCredentials();

  private firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');

  constructor(
    public modal: AuthModal,
    private authenticationService: Authentication,
  ) {
    // Reset the form whenever the modal opens or switches mode and
    // focus the first field once it is rendered
    effect(() => {
      this.modal.isOpen();
      this.modal.mode();
      this.reset();
      setTimeout(() => this.firstInput()?.nativeElement.focus());
    });
  }

  public isLogin(): boolean {
    return this.modal.mode() === 'login';
  }

  public switchTo(mode: AuthModalMode, event: Event): void {
    event.preventDefault();
    this.modal.switchTo(mode);
  }

  public close(): void {
    this.modal.close();
  }

  // Inert links from the wireframe that only anchor to the current page
  public stayHere(event: Event): void {
    event.preventDefault();
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.modal.isOpen()) {
      this.close();
    }
  }

  public onSubmit(): void {
    this.formError = '';
    if (this.isLogin()) {
      this.doLogin();
    } else {
      this.doRegister();
    }
  }

  private doLogin(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required';
      return;
    }
    const user = { email: this.credentials.email } as User;
    this.submitting = true;
    this.authenticationService.login(user, this.credentials.password)
      .subscribe({
        next: () => this.close(),
        error: (error: any) => {
          this.submitting = false;
          this.formError = error?.error?.message || 'Login failed, please check your email and password';
        }
      });
  }

  private doRegister(): void {
    const c = this.credentials;
    if (!c.name || !c.email || !c.password || !c.confirmPassword) {
      this.formError = 'All fields are required';
      return;
    }
    if (c.password !== c.confirmPassword) {
      this.formError = 'Passwords do not match';
      return;
    }
    if (!c.agreed) {
      this.formError = 'You must agree to the Terms of Use and Privacy Policy';
      return;
    }
    const user = { name: c.name, email: c.email } as User;
    this.submitting = true;
    this.authenticationService.register(user, c.password)
      .subscribe({
        next: () => this.close(),
        error: (error: any) => {
          this.submitting = false;
          if (error?.error?.code === 11000) {
            this.formError = 'An account with that email already exists';
          } else {
            this.formError = error?.error?.message || 'Sign up failed, please try again';
          }
        }
      });
  }

  private reset(): void {
    this.credentials = this.emptyCredentials();
    this.formError = '';
    this.submitting = false;
  }

  private emptyCredentials() {
    return { name: '', email: '', password: '', confirmPassword: '', agreed: false };
  }
}
