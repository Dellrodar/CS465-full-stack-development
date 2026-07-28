import { roomData } from "../../data/rooms.js";

/* GET Rooms view */
const rooms = (req, res) => {
    res.render('rooms', { title: 'Travlr Getaways', roomData });
};

export default rooms;