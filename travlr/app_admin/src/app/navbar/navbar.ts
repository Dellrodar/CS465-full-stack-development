import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Authentication } from '../services/authentication';
import { AuthModal } from '../services/auth-modal';
import { Cart } from '../services/cart';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private authenticationService: Authentication,
    private router: Router,
    private authModal: AuthModal,
    private cart: Cart,
  ) {}

  public cartCount(): number {
    return this.cart.count();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }

  public openLogin(): void {
    this.authModal.open('login');
  }

  public onLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }
}
