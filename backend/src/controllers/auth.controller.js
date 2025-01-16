import { generateToken } from "../lib/utils.js";
import User from "../modles/user.model.js";
import bcrypt from "bcryptjs"
// import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const {fullName, email, password }= req.body;
    try {

       if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"})
       }
       if (password.length < 6){
        return res.status(400).json({message: "password must atleast have 6 characters"})
       } 

       const user = await User.findOne({email})

       if(user) return res.status(400).json({message: "Email already exists"});

       const salt = await bcrypt.genSalt(10)
       const hashedPassword  = await bcrypt.hash(password,salt)
       
       const newUser = new User({
        fullname:fullName,
        email,
        password: hashedPassword
       })

       if (newUser){
        generateToken(newUser._id, res)
        await newUser.save() ;

        res.status(201).json({
            _id:newUser._id,
            fullName: newUser.fullname,
            email: newUser.email,
            // profilePic: newUser.profilePic
        })
        
       } else {
        res.status(400).json({message : "Invalid user data"});
       }


    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "internal server error signup endpoint"})
        
    }
};

export const login = async (req,res) => {

    const {email, password} = req.body;
    try {
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({message: "Invalid credentials"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid credentials"});
    }

    generateToken(user._id, res)

    res.status(200).json({
        _id:user._id,
        fullName: user.fullname,
        email,
        
    })
        
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "internal server error login endpoint"})
        
    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "You have been logged out"})
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "internal server error logout endpoint"})
    }
};

export const updateProfile = async (req,res) => {
    try {
        const { pPicture } = req.body;
        const userId = req.user._id;

        if(!pPicture){
            res.status(400).json({message : "profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(pPicture)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true})

        res.status(200).json(updatedUser)

    } catch (error) {
        
    }

}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error during checkAuth:", error);
        res.status(500).json({message: "internal server error checkAuth endpoint"})

        
    }
}