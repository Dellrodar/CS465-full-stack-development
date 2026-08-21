import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reservation } from '../models/reservation';
import { TripData } from '../services/trip-data';

// The logged in user's reservations with the option to cancel
@Component({
  selector: 'app-reservations',
  imports: [CommonModule, RouterLink],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations implements OnInit {
  reservations = signal<Reservation[]>([]);
  loading = signal<boolean>(true);
  message = signal<string>('');

  constructor(private tripDataService: TripData) {}

  ngOnInit(): void {
    this.tripDataService.getReservations()
      .subscribe({
        next: (value: Reservation[]) => {
          this.reservations.set(value);
          this.loading.set(false);
        },
        error: () => {
          this.message.set('Unable to load your reservations');
          this.loading.set(false);
        },
      });
  }

  public cancel(reservation: Reservation): void {
    if (!confirm('Cancel your reservation for "' + reservation.tripName + '"?')) {
      return;
    }
    this.tripDataService.cancelReservation(reservation._id)
      .subscribe({
        next: (updated: Reservation) => {
          this.reservations.update(list =>
            list.map(item => item._id === updated._id ? updated : item)
          );
        },
        error: (error: any) => {
          this.message.set(error?.error?.message || 'Unable to cancel the reservation');
        },
      });
  }
}
