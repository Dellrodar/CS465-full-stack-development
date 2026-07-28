// Bring in the DB connection and the Trip schema
import { readFileSync } from 'fs';
import Mongoose from "./db.js";
import Trip from "./travlr.js";

// Read seed data from JSON file
const trips = JSON.parse(readFileSync('./data/trips.json', 'utf8'));

// delete existing records, then insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

// Close the MongoDB connection and exit
seedDB().then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
});