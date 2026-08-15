import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
    providedIn: 'root'
})

export class TripData {
    constructor(private http: HttpClient) {}

    baseUrl = 'http://localhost:3000/api';
    tripsUrl = this.baseUrl + '/trips';

    getTrips(tripCode: string = ''): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.tripsUrl + '/' + tripCode);
    }

    addTrip(formData: Trip): Observable<Trip> {
        return this.http.post<Trip>(this.tripsUrl, formData);
    }

    // Update a trip. The optional code identifies the existing record so
    // the trip code itself can be changed by the caller
    updateTrip(formData: Trip, code: string = formData.code): Observable<Trip> {
        return this.http.put<Trip>(this.tripsUrl + '/' + code, formData);
    }

    deleteTrip(tripCode: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(this.tripsUrl + '/' + tripCode);
    }

    // Read only list of registered users for the admin site
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl + '/users');
    }

    // Call to our /login endpoint, returns JWT
    login(user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripData::login');
        return this.handleAuthAPICall('login', user, passwd);
    }

    // Call to our /register endpoint, creates user and returns JWT
    register(user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripData::register');
        return this.handleAuthAPICall('register', user, passwd);
    }

    // helper method to process both login and register methods
    handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripData::handleAuthAPICall');
        const formData = {
            name: user.name,
            email: user.email,
            password: passwd
        };

        return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
    }
}
