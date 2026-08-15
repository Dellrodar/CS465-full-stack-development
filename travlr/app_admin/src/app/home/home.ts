import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  destinations = [
    { name: 'Gale Reef', image: 'reef1.jpg' },
    { name: 'Dawson’s Reef', image: 'reef2.jpg' },
    { name: 'Claire’s Reef', image: 'reef3.jpg' },
  ];
}
