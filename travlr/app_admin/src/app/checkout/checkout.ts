import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Cart } from '../services/cart';
import { Authentication } from '../services/authentication';
import { AuthModal } from '../services/auth-modal';
import { TripData } from '../services/trip-data';

// Checkout page: review the cart choose the number of people per trip
// and confirm the reservations. No payment is collected
@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  submitting = signal<boolean>(false);
  message = signal<string>('');

  constructor(
    public cart: Cart,
    private authenticationService: Authentication,
    private authModal: AuthModal,
    private tripDataService: TripData,
    private router: Router,
  ) {}

  public setPeople(tripCode: string, value: string | number): void {
    this.cart.setPeople(tripCode, Number(value));
  }

  public remove(tripCode: string): void {
    this.cart.remove(tripCode);
  }

  public confirm(): void {
    this.message.set('');
    if (this.cart.count() === 0) {
      return;
    }
    if (!this.authenticationService.isLoggedIn()) {
      this.authModal.open('login');
      return;
    }

    const items = this.cart.items().map(item => ({ tripCode: item.tripCode, people: item.people }));
    this.submitting.set(true);
    this.tripDataService.createReservations(items)
      .subscribe({
        next: () => {
          this.cart.clear();
          this.router.navigate(['/reservations']);
        },
        error: (error: any) => {
          this.submitting.set(false);
          if (error?.status === 401) {
            this.authModal.open('login');
          }
          this.message.set(error?.error?.message || 'Unable to confirm the reservation, please try again');
        },
      });
  }
}
