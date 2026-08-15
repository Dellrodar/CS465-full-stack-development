import { Routes } from '@angular/router';
import { Home } from './home/home';
import { TripListing } from './trip-listing/trip-listing';
import { News } from './news/news';
import { Reservations } from './reservations/reservations';
import { Checkout } from './checkout/checkout';
import { Admin } from './admin/admin';
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
