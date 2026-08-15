import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { AuthModal } from '../services/auth-modal';

// Functional route guard that only allows logged in users through and
// sends everyone else home with the login modal open
export const authGuard: CanActivateFn = () => {
    const authenticationService = inject(Authentication);
    const router = inject(Router);
    const authModal = inject(AuthModal);

    if (authenticationService.isLoggedIn()) {
        return true;
    }
    authModal.open('login');
    return router.createUrlTree(['']);
};
