// A trip waiting in the checkout cart before it becomes a reservation
export interface CartItem {
    tripCode: string;
    name: string;
    start: string;
    perPerson: number;
    people: number;
}
