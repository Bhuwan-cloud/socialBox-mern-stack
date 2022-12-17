import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//  register function 

export const register = async (req, res) => {

    try {

        //  destrucuring a request body object (req comes from frontend )
        const { firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            occupation,
            location } = req.body;

        //  salting a password 
        const salt = await bcrypt.genSalt(10);

        //  hasing password
        const passwordHash = await bcrypt.hash(password, salt);

        //  creating a new user object
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            occupation,
            location,
            viewedProfile: Math.floor(Math.random() * 1000), // just to set a random value
            impressions: Math.floor(Math.random() * 1000)
        });

        // saving user to database 
        const savedUser = await newUser.save();

        // sending response
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//  login function 
export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        //  quering from mongoDb to get user information 
        const user = await User.findOne({ email: email });
        // if user does not exist 
        if (!user) return res.status(400).json({ message: "User does not exist" });

        // comparing passwords (req password vs saved password)
        const isMatch = await bcrypt.compare(password, user.password);

        // if password doesnot match 
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials " });

        //  generating jwt token 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        //  deleting password
        delete user.password;

        //  sending response 
        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}