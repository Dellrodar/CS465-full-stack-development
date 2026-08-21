import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Authentication } from '../services/authentication';

// Interceptor that injects our JWT as a Bearer token on the
// Authorization header for every outgoing API call except the
// two authentication endpoints which do not require a token
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
    const authenticationService = inject(Authentication);

    // console.log('Interceptor::URL ' + request.url);
    const isAuthAPI = request.url.endsWith('/login')
        || request.url.endsWith('/register');

    if (authenticationService.isLoggedIn() && !isAuthAPI) {
        const token = authenticationService.getToken();
        // console.log(token);
        const authReq = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq);
    }
    return next(request);
};
