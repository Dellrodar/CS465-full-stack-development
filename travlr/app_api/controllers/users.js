import User from '../models/user.js';

// GET: /users - Lists registered users for the admin site
// Only the name and email are returned, never the password hash or salt
const usersList = async (req, res) => {
    try {
        const query = await User
            .find({}, 'name email')
            .sort({ name: 1 })
            .exec();
        return res.status(200).json(query);
    } catch (err) {
        return res.status(400).json(err);
    }
};

export {
    usersList,
};
