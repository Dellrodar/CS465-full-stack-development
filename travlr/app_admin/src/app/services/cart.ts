import { Inject, Injectable, computed, signal } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { CartItem } from '../models/cart-item';
import { Trip } from '../models/trip';

const CART_KEY = 'travlr-cart';
const CART_VERSION = 1;

// Browser side checkout cart. It lives in local storage per browser so
// it survives reloads and logging out. It is only emptied after the
// reservations are confirmed with the API
@Injectable({
    providedIn: 'root'
})
export class Cart {
    readonly items = signal<CartItem[]>([]);

    // Number of trips in the cart used for the navbar badge
    readonly count = computed(() => this.items().length);

    readonly total = computed(() =>
        this.items().reduce((sum, item) => sum + item.perPerson * item.people, 0)
    );

    constructor(@Inject(BROWSER_STORAGE) private storage: Storage) {
        this.items.set(this.load());
    }

    // Add a trip. Reserving the same trip again adds a person instead of
    // creating a duplicate line
    public add(trip: Trip): void {
        this.items.update(list => {
            const existing = list.find(item => item.tripCode === trip.code);
            if (existing) {
                return list.map(item =>
                    item.tripCode === trip.code ? { ...item, people: item.people + 1 } : item
                );
            }
            return [...list, {
                tripCode: trip.code,
                name: trip.name,
                start: String(trip.start),
                perPerson: Number(String(trip.perPerson).replace(/[^0-9.]/g, '')) || 0,
                people: 1,
            }];
        });
        this.save();
    }

    public remove(tripCode: string): void {
        this.items.update(list => list.filter(item => item.tripCode !== tripCode));
        this.save();
    }

    public setPeople(tripCode: string, people: number): void {
        const count = Math.max(1, Math.floor(Number(people) || 1));
        this.items.update(list =>
            list.map(item => item.tripCode === tripCode ? { ...item, people: count } : item)
        );
        this.save();
    }

    public clear(): void {
        this.items.set([]);
        this.save();
    }

    private save(): void {
        this.storage.setItem(CART_KEY, JSON.stringify({ v: CART_VERSION, items: this.items() }));
    }

    private load(): CartItem[] {
        try {
            const raw = this.storage.getItem(CART_KEY);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            if (parsed?.v !== CART_VERSION || !Array.isArray(parsed.items)) {
                return [];
            }
            return parsed.items;
        } catch {
            return [];
        }
    }
}
