import { model } from 'mongoose';
import Trip from '../models/travlr.js';

const Model = model('trips');

const tripsList = async(req, res) => {
    const query = await Model
        .find({})
        .exec();
    
    if (!query) {
        return res.status(404).json(err);
    } else {
        return res.status(200).json(query);
    }
};

const addTrips = async(req, res) => {
    const newTrip = new Trip ({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
    });

    const query = await newTrip.save();

    if(!query) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(query);
    }
}

const tripsFindByCode = async(req, res) => {
    const query = await Model
        .find({ 'code': req.params.tripCode })
        .exec();
    
    if (!query) {
        return res.status(404).json(err);
    } else {
        return res.status(200).json(query);
    }
};

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client

const updateTrip = async(req, res) => {
    // Uncomment for debugging
    // console.log(req.params);
    // console.log(req.body);

    const query = await Model
        .findOneAndUpdate({
            'code': req.params.tripCode
        }, {
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description,
        })
        .exec();

    if (!query) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(query);
    };
};


export {
    addTrips,
    tripsList,
    tripsFindByCode,
    updateTrip,
};
