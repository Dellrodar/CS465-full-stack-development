import { Routes } from '@angular/router';
import { Home } from './home/home';
import { TripListing } from './trip-listing/trip-listing';
import { News } from './news/news';
import { Reservations } from './reservations/reservations';
import { Checkout } from './checkout/checkout';
import { Admin } from './admin/admin';
import { AdminTravel } from './admin/admin-travel/admin-travel';
import { AdminReservations } from './admin/admin-reservations/admin-reservations';
import { AdminUsers } from './admin/admin-users/admin-users';
import { AdminSettings } from './admin/admin-settings/admin-settings';
import { AddTrip } from './add-trip/add-trip';
import { EditTrip } from './edit-trip/edit-trip';
import { authGuard } from './utils/auth.guard';

export const routes: Routes = [{
    path: '',
    component: Home,
    pathMatch: 'full',
}, {
    path: 'travel',
    component: TripListing,
}, {
    path: 'news',
    component: News,
}, {
    path: 'reservations',
    component: Reservations,
    canActivate: [authGuard],
}, {
    path: 'checkout',
    component: Checkout,
}, {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [{
        path: '',
        redirectTo: 'travel',
        pathMatch: 'full',
    }, {
        path: 'travel',
        component: AdminTravel,
    }, {
        path: 'reservations',
        component: AdminReservations,
    }, {
        path: 'users',
        component: AdminUsers,
    }, {
        path: 'settings',
        component: AdminSettings,
    }],
}, {
    path: 'add-trip',
    component: AddTrip,
}, {
    path: 'edit-trip',
    component: EditTrip,
}, {
    path: '**',
    redirectTo: '',
}];
