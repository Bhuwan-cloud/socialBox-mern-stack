import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {

    try {

        // these parameters are send from frontend 
        const { userId, description, picturePath } = req.body;

        /* USERS create*/

        // fetching all user data 
        const user = await User.findById(userId);

        // crating a newPost object 
        const newPost = await Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []

        });

        // saving the object in the database 
        await newPost.save();

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}