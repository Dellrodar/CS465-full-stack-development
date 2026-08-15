import { Inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({
    providedIn: 'root'
})

export class Authentication {
    // Setup our storage and service access
    constructor(
        @Inject(BROWSER_STORAGE) private storage: Storage,
        private tripDataService: TripData
    ) {
        this.loggedIn.set(this.hasValidToken());
    }

    // Variable to handle Authentication Responses
    authResp: AuthResponse = new AuthResponse();

    // Signal that tracks our login state so the application is
    // notified when the user logs in or out
    private loggedIn = signal<boolean>(false);

    // Get our token from our Storage provider.
    // NOTE: For this application we have decided that we will name
    // the key for our token 'travlr-token'
    public getToken(): string {
        const out = this.storage.getItem('travlr-token');

        // Make sure we return a string even if we don't have a token
        if (!out) {
            return '';
        }
        return out;
    }

    // Save our token to our Storage provider.
    public saveToken(token: string): void {
        this.storage.setItem('travlr-token', token);
        this.loggedIn.set(true);
    }

    // Logout of our application and remove the JWT from Storage
    public logout(): void {
        this.storage.removeItem('travlr-token');
        this.loggedIn.set(false);
    }

    // Check that we hold a token and that it has not expired
    private hasValidToken(): boolean {
        const token: string = this.getToken();
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > (Date.now() / 1000);
        } else {
            return false;
        }
    }

    // Boolean to determine if we are logged in and the token is
    // still valid. Even if we have a token we will still have to
    // reauthenticate if the token has expired. Reading the loggedIn
    // signal keeps template bindings reactive under zoneless
    // change detection
    public isLoggedIn(): boolean {
        return this.loggedIn() && this.hasValidToken();
    }

    // Retrieve the current user. This function should only be called
    // after the calling method has checked to make sure that the user
    // isLoggedIn.
    public getCurrentUser(): User {
        const token: string = this.getToken();
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name } as User;
    }

    // Login method that leverages the login method in tripDataService.
    // The token is saved as a side effect and the Observable is returned
    // so callers can react to success or failure
    public login(user: User, passwd: string): Observable<AuthResponse> {
        return this.tripDataService.login(user, passwd)
            .pipe(tap((value: AuthResponse) => this.handleAuthResponse(value)));
    }

    // Register method that leverages the register method in
    // tripDataService. This method is nearly identical to the
    // login method because the behavior of the API logs a new user in
    // immediately upon registration
    public register(user: User, passwd: string): Observable<AuthResponse> {
        return this.tripDataService.register(user, passwd)
            .pipe(tap((value: AuthResponse) => this.handleAuthResponse(value)));
    }

    // Shared handler that stores the JWT returned by login or register
    private handleAuthResponse(value: AuthResponse): void {
        if (value) {
            this.authResp = value;
            this.saveToken(this.authResp.token);
        }
    }
}
