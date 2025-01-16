import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../modles/message.model.js";
import User from "../modles/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const getMessages = async(req, res) => {
    try {
       const {id: userToChatId} = req.params
       const myId = req.user._id
       const messages = await Message.find({
        $or:[
            {senderId:myId , receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ]
       })

       res.status(200).json(messages)
    } catch (error) {
        console.error("Error during messages:", error);
        res.status(500).json({message: "internal server error messages endpoint"})
    }
}

export const sendMessage = async(req, res) => {
    try {
        const {textsent} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text:textsent

        })

        await newMessage.save()

        const receiverSocketId = getRecieverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error during sending messages:", error);
        res.status(500).json({message: "internal server error sendMessages endpoint"})
        
    }
}