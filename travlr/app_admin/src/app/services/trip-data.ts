import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
    providedIn: 'root'
})

export class TripData {
    constructor(private http: HttpClient) {}

    tripsUrl = 'http://localhost:3000/api/trips';

    getTrips(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.tripsUrl);
    }
}
