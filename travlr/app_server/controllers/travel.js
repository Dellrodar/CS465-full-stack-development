// import fs from 'fs'
import { trips } from '../../data/trips.js';
// const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

/* GET Travel view */
const travel = (req, res) => {
    res.render('travel', { title: 'Travlr Getaways', trips });
};

export default travel;
