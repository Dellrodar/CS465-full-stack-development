// A confirmed or cancelled trip reservation returned by the API
export interface Reservation {
    _id: string;
    tripCode: string;
    tripName: string;
    start: string;
    perPerson: number;
    people: number;
    total: number;
    status: 'confirmed' | 'cancelled';
    createdAt: string;
}

// Shape sent to the API when confirming the cart
export interface ReservationRequest {
    tripCode: string;
    people: number;
}
