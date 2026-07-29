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

export {
    tripsList,
    tripsFindByCode
};
