import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trips } from '../../data/trips';
import { TripCard } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';

// Customer facing trip listing. Trip management lives in the admin area
@Component({
  selector: 'app-trip-listing',
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData],
})

export class TripListing implements OnInit {
  trips = signal<Array<any>>(trips);
  message: string = '';

  constructor(private tripDataService: TripData) {}

  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: Trip[]) => {
          this.trips.set(value);
          if(value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          } else {
            this.message = 'There were no trips retireved from the database';
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  }

  ngOnInit(): void {
    this.getStuff();
  }
}
