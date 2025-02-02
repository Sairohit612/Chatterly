import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = ((set) => ({

    messages : [],
    users : [],
    selecteduser : null,

    isMessagesLoading : false,
    isUsersLoading : false,

    getUsers: async() =>{
        // isUsersLoading: true

        try {
            const res= await axiosInstance.get("/messages/users")
            set({users: res.data})
        } catch (error) {
            toast.error("users fetch failed")
        }finally{
            // set({ isUsersLoading: false });
        }
    } ,

    getMessages: async(userId) =>{
        set({isMessagesLoading :true})

        try {
            const res= await axiosInstance.get(`messages/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error("messages fetch failed")
            
        }finally {
            set({isMessagesLoading:false})
        }

    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unSubscribeToMessages:() => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser: (selecteduser) => set({selecteduser})

}));