import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';
import { TripData } from '../services/trip-data';


@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard implements OnInit {
  @Input('trip') trip: any;
  @Output() deleted = new EventEmitter<Trip>();

  constructor(
    private router: Router,
    private authenticationService: Authentication,
    private tripDataService: TripData,
  ) {}

  ngOnInit(): void {

  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(trip: Trip) {
    if (!confirm('Delete trip "' + trip.name + '"?')) {
      return;
    }
    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: () => {
          this.deleted.emit(trip);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }
}
