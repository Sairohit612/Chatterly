import jwt from "jsonwebtoken"
import User from "../modles/user.model.js"

export const protectRoute = async (req , res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            res.status(402).json({message: "User not logged in"})
        }

        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET)

        if(!decodedCookie){
            res.status(402).json({message: "Invalid login"})
        }

        const user = await User.findById(decodedCookie.userId).select("-password")

        if(!user){
            res.status(404).json({message: "User not found"})
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Error during verfying:", error);
        res.status(500).json({message: "internal server error middleware endpoint"})
        
    }

}