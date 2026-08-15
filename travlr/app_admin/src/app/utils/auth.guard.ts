import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';

// Functional route guard that only allows logged in users through and
// sends everyone else to the login page
export const authGuard: CanActivateFn = () => {
    const authenticationService = inject(Authentication);
    const router = inject(Router);

    if (authenticationService.isLoggedIn()) {
        return true;
    }
    return router.createUrlTree(['login']);
};
