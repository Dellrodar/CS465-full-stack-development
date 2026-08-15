import mongoose from 'mongoose';
import Reservation from '../models/reservation.js';
import Trip from '../models/travlr.js';
import User from '../models/user.js';

// Trips store perPerson as a string so strip any formatting before math
const toPrice = (value) => Number(String(value).replace(/[^0-9.]/g, ''));

// POST: /reservations - Creates reservations for the logged in user
// Body: { items: [{ tripCode, people }] }
// Every item is validated before anything is written so a bad item
// never leaves a partial order behind
const reservationsCreate = async (req, res) => {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'At least one reservation item is required' });
    }

    const docs = [];
    for (const item of items) {
        const people = Number(item?.people);
        if (!Number.isInteger(people) || people < 1) {
            return res.status(400).json({ message: 'People must be a whole number of at least 1' });
        }
        const trip = await Trip.findOne({ code: item?.tripCode }).exec();
        if (!trip) {
            return res.status(400).json({ message: 'Unknown trip code ' + item?.tripCode });
        }
        const perPerson = toPrice(trip.perPerson);
        if (Number.isNaN(perPerson)) {
            return res.status(400).json({ message: 'Trip ' + trip.code + ' has an invalid price' });
        }
        docs.push({
            user: req.auth._id,
            trip: trip._id,
            tripCode: trip.code,
            tripName: trip.name,
            start: trip.start,
            perPerson,
            people,
            total: perPerson * people,
        });
    }

    try {
        const user = await User.findById(req.auth._id).exec();
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const created = await Reservation.insertMany(docs);
        await User.findByIdAndUpdate(user._id, {
            $push: { reservations: { $each: created.map(r => r._id) } }
        }).exec();
        return res.status(201).json(created);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// GET: /reservations - Lists the logged in user's reservations newest first
const reservationsList = async (req, res) => {
    try {
        const query = await Reservation
            .find({ user: req.auth._id })
            .sort({ createdAt: -1 })
            .exec();
        return res.status(200).json(query);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// DELETE: /reservations/:id - Cancels one of the logged in user's reservations
// The record is kept with a cancelled status so history is preserved
const reservationCancel = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid reservation id' });
    }
    try {
        const query = await Reservation
            .findOneAndUpdate(
                { _id: id, user: req.auth._id },
                { status: 'cancelled' },
                { returnDocument: 'after' }
            )
            .exec();
        if (!query) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        return res.status(200).json(query);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// TODO admin: GET /reservations/all listing every reservation with the
// user populated behind requireAdmin is planned as a follow up

export {
    reservationsCreate,
    reservationsList,
    reservationCancel,
};
