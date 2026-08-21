import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminReservation, Reservation } from '../../models/reservation';
import { TripData } from '../../services/trip-data';

type StatusFilter = 'all' | 'confirmed' | 'cancelled';

// Admin view of every reservation with search status filter paging and cancel
@Component({
  selector: 'app-admin-reservations',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-reservations.html',
  styleUrl: './admin-reservations.css',
})
export class AdminReservations implements OnInit {
  readonly pageSize = 5;

  reservations = signal<AdminReservation[]>([]);
  query = signal<string>('');
  status = signal<StatusFilter>('all');
  page = signal<number>(0);
  message = signal<string>('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.status();
    return this.reservations().filter(reservation => {
      if (status !== 'all' && reservation.status !== status) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [
        reservation.user?.name,
        reservation.user?.email,
        reservation.tripName,
        reservation.tripCode,
      ].some(value => value?.toLowerCase().includes(q));
    });
  });

  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  pageRows = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor(private tripDataService: TripData) {}

  ngOnInit(): void {
    this.tripDataService.getAllReservations()
      .subscribe({
        next: (value: AdminReservation[]) => this.reservations.set(value),
        error: () => this.message.set('Unable to load reservations'),
      });
  }

  public onSearch(value: string): void {
    this.query.set(value);
    this.page.set(0);
  }

  public onStatus(value: string): void {
    this.status.set(value as StatusFilter);
    this.page.set(0);
  }

  public previous(): void {
    this.page.update(page => Math.max(0, page - 1));
  }

  public next(): void {
    this.page.update(page => Math.min(this.pageCount() - 1, page + 1));
  }

  public cancel(reservation: AdminReservation): void {
    const who = reservation.user?.name ?? 'this customer';
    if (!confirm('Cancel ' + who + "'s reservation for \"" + reservation.tripName + '"?')) {
      return;
    }
    this.tripDataService.cancelReservation(reservation._id)
      .subscribe({
        next: (updated: Reservation) => {
          // The API returns the raw record so keep the populated customer
          this.reservations.update(list =>
            list.map(item => item._id === updated._id ? { ...item, ...updated, user: item.user } : item)
          );
        },
        error: (error: any) => {
          this.message.set(error?.error?.message || 'Unable to cancel the reservation');
        },
      });
  }
}
