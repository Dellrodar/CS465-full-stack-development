import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

// Public trip card shown on the customer travel listing
@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input('trip') trip: any;
}
