import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { AuthModal } from '../services/auth-modal';

// Functional route guard for the admin area. Logged out users are sent
// home with the login modal open and logged in non admins are sent home
export const adminGuard: CanActivateFn = () => {
    const authenticationService = inject(Authentication);
    const router = inject(Router);
    const authModal = inject(AuthModal);

    if (authenticationService.isAdmin()) {
        return true;
    }
    if (!authenticationService.isLoggedIn()) {
        authModal.open('login');
    }
    return router.createUrlTree(['']);
};
