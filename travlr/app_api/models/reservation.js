import { model, Schema } from 'mongoose';

// A reservation links a user to a trip and keeps a snapshot of the trip
// details at booking time so history survives later trip edits
const reservationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    trip: { type: Schema.Types.ObjectId, ref: 'trips', required: true },
    tripCode: { type: String, required: true },
    tripName: { type: String, required: true },
    start: { type: Date, required: true },
    perPerson: { type: Number, required: true },
    people: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, { timestamps: true });

const Reservation = model('reservations', reservationSchema);

export default Reservation;
