import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';
import { TripData } from '../../services/trip-data';

// Admin trip list from the wireframe: searchable paged table with
// Add a Trip Edit and delete actions
@Component({
  selector: 'app-admin-travel',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-travel.html',
  styleUrl: './admin-travel.css',
})
export class AdminTravel implements OnInit {
  readonly pageSize = 5;

  trips = signal<Trip[]>([]);
  query = signal<string>('');
  page = signal<number>(0);
  message = signal<string>('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.trips();
    }
    return this.trips().filter(trip =>
      [trip.code, trip.name, trip.resort].some(value => value?.toLowerCase().includes(q))
    );
  });

  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  pageTrips = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor(private tripDataService: TripData) {}

  ngOnInit(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: Trip[]) => this.trips.set(value),
        error: () => this.message.set('Unable to load trips'),
      });
  }

  public onSearch(value: string): void {
    this.query.set(value);
    this.page.set(0);
  }

  public previous(): void {
    this.page.update(page => Math.max(0, page - 1));
  }

  public next(): void {
    this.page.update(page => Math.min(this.pageCount() - 1, page + 1));
  }

  public deleteTrip(trip: Trip): void {
    if (!confirm('Delete trip "' + trip.name + '"?')) {
      return;
    }
    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: () => {
          this.trips.update(list => list.filter(item => item.code !== trip.code));
          // Step back a page if the current page is now empty
          this.page.update(page => Math.min(page, this.pageCount() - 1));
        },
        error: () => this.message.set('Unable to delete trip ' + trip.code),
      });
  }
}
