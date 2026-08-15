import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { TripData } from '../../services/trip-data';

// Read only admin users list styled like the admin trip list
@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  readonly pageSize = 5;

  users = signal<User[]>([]);
  query = signal<string>('');
  page = signal<number>(0);
  message = signal<string>('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.users();
    }
    return this.users().filter(user =>
      [user.name, user.email, user.role].some(value => value?.toLowerCase().includes(q))
    );
  });

  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  pageUsers = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor(private tripDataService: TripData) {}

  ngOnInit(): void {
    this.tripDataService.getUsers()
      .subscribe({
        next: (value: User[]) => this.users.set(value),
        error: () => this.message.set('Unable to load users'),
      });
  }

  public onSearch(value: string): void {
    this.query.set(value);
    this.page.set(0);
  }

  public previous(): void {
    this.page.update(page => Math.max(0, page - 1));
  }

  public next(): void {
    this.page.update(page => Math.min(this.pageCount() - 1, page + 1));
  }
}
