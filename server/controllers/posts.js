import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    // these parameters are send from frontend
    const { userId, description, picturePath } = req.body;

    /*  CREATE Function */

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
      comments: [],
    });

    // saving the object in the database
    await newPost.save();

    // grabbing all posts (means once posts are saved  to db ; new updaetd posts are grabbed)
    const post = await Post.find();

    // sending response as updated posts
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*  READ Function */

export const getFeedPosts = async (req, res) => {
  try {
    // grabbing all posts (means once posts are saved  to db ; new updaetd posts are grabbed)
    const post = await Post.find();

    // sending response as updated posts
    res.status(200).json(post);

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {

    const { userId } = req.params;
    // grabbing user post only by sending userId 
    const post = await Post.find({userId});

    // sending response as updated posts
    res.status(200).json(post);

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE  Function 

export const likePost = async (req, res)=>{
  try {

    const { id } = req.params; // id comes from query string 
    const {userId} = req.body; // userId comes form form in froentend 
    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);

    if(isLiked){
      post.likes.delete(userId);
    }else{
      post.likes.set(userId, true);
    }

    // updating posts 
    const updatedPost = await Post.findByIdAndUpdate(id,{likes: post.likes}, {new: true});

    // returning upated posts 
    res.status(200).json(updatedPost);

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

