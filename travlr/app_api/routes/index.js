import { Router } from 'express';
import jwt from 'jsonwebtoken'; // Enable JSON Web Tokens
import { tripsList, tripsFindByCode, addTrips, updateTrip } from '../controllers/trips.js';
import { register, login } from '../controllers/authentication.js';

// Method to authenticate our JWT
const authenticateJWT = (req, res, next) => {
    // console.log('In Middleware');

    const authHeader = req.headers['authorization'];
    // console.log('Auth Header: ' + authHeader);

    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    // console.log('Token: ' + token);

    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    // console.log(process.env.JWT_SECRET);
    // console.log(jwt.decode(token));
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            console.log('Token Validation Error!');
            return res.sendStatus(401);
        }
        req.auth = verified; // Set the auth param to the decoded object
        next(); // We need to continue or this will hang forever
    });
};

const router = Router();

// define routes for our authentication endpoints
router.route('/register').post(register);
router.route('/login').post(login);

// define routes for our trips endpoint
router.route('/trips').get(tripsList);
router.route('/trips').post(authenticateJWT, addTrips);
router.route('/trips/:tripCode').get(tripsFindByCode);
router.route('/trips/:tripCode').put(authenticateJWT, updateTrip);

export default router
