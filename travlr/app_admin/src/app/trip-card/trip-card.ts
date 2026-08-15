import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Trip } from '../models/trip';
import { Cart } from '../services/cart';

// Public trip card shown on the customer travel listing
@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input('trip') trip: any;

  // Briefly true after Reserve is pressed to acknowledge the add
  added = signal<boolean>(false);

  constructor(private cart: Cart) {}

  public reserve(trip: Trip): void {
    this.cart.add(trip);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }
}
