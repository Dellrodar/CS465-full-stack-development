import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
    providedIn: 'root'
})

export class TripData {
    constructor(private http: HttpClient) {}

    tripsUrl = 'http://localhost:3000/api/trips';

    getTrips(tripCode: string = ''): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.tripsUrl + '/' + tripCode);
    }

    addTrip(formData: Trip): Observable<Trip> {
        return this.http.post<Trip>(this.tripsUrl, formData);
    }

    updateTrip(formData: Trip): Observable<Trip> {
        return this.http.put<Trip>(this.tripsUrl + '/' + formData.code, formData);
    };
}
