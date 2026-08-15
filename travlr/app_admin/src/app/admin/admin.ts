import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Admin shell with the left hand navigation from the wireframe and a
// content area that hosts the admin child routes
@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  links = [
    { path: 'travel', label: 'Travel' },
    { path: 'reservations', label: 'Reservations' },
    { path: 'users', label: 'Users' },
    { path: 'settings', label: 'Settings' },
  ];
}
