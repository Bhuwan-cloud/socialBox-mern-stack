import User from "../models/User.js";

// READ

export const getUser = async (req, res) => {
    try {
        // grabbing user._id from frontend 
        const { id } = req.params;
        // getting users in 'user' variable from MongoDB by a findById query
        const user = await User.findById(id);
        // sending response back 
        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);
        // formatting data 
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        // sending friends to frontend 
        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


// UPDATE 

export const addRemoveFriend = async (req, res) => {
    try {

        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            // updating friends by using filter function to replace data 
            // LHS is replaced  by RHS when this code is triggered
            user.friends = user.friends.filter((id) => { id !== friendId });
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // if friends are not included  in users database
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        //  saving user to DB 
        await user.save();
        await friend.save();

        // formatting data 
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        // sending response to froentend 

        res.status(200).json(formattedFriends);


    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}