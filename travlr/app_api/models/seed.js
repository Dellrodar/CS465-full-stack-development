// Bring in the DB connection and the Trip and User schemas
import { readFileSync } from 'fs';
import Mongoose from "./db.js";
import Trip from "./travlr.js";
import User from "./user.js";

// Read seed data from JSON files
const trips = JSON.parse(readFileSync('./data/trips.json', 'utf8'));
const users = JSON.parse(readFileSync('./data/users.json', 'utf8'));

// delete existing trips, then insert seed data
const seedTrips = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

// upsert the test users by email so seeding never removes real accounts
// and always leaves known logins available
const seedUsers = async () => {
    for (const { name, email, password, role } of users) {
        const user = await User.findOne({ email }).exec() ?? new User({ email });
        user.name = name;
        user.role = role ?? 'user';
        user.setPassword(password);
        await user.save();
    }
};

const seedDB = async () => {
    await seedTrips();
    await seedUsers();
};

// Close the MongoDB connection and exit
seedDB().then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
});
