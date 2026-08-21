import { Injectable, signal } from '@angular/core';

export type AuthModalMode = 'login' | 'signup';

// Signal backed state for the shared login and sign up modal so any
// component or guard can open it without a route change
@Injectable({
    providedIn: 'root'
})
export class AuthModal {
    readonly isOpen = signal<boolean>(false);
    readonly mode = signal<AuthModalMode>('login');

    public open(mode: AuthModalMode = 'login'): void {
        this.mode.set(mode);
        this.isOpen.set(true);
    }

    public close(): void {
        this.isOpen.set(false);
    }

    public switchTo(mode: AuthModalMode): void {
        this.mode.set(mode);
    }
}
