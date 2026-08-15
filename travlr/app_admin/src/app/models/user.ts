export class User {
    _id?: string;
    email: string;
    name: string;
    role?: 'user' | 'admin';

    constructor() {
        this.email = '';
        this.name = '';
    }
}
