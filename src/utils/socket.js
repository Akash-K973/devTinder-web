const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecureRoomId = (userId,targetUserId) =>{
    const sortedIds = [userId, targetUserId].sort();
    const roomString = sortedIds.join("_");

    return crypto.createHash("sha256").update(roomString).digest("hex");
}

const initializeSocket = (server)=>{
    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173",
        }
    })
    io.on("connection",(socket)=>{
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            const room = getSecureRoomId(userId,targetUserId);
            console.log(firstName + "Joined Room" +room);
            socket.join(room);
        })
        socket.on("sendMessage",async ({firstName,userId,targetUserId,text})=>{
    
            try{
                const room = getSecureRoomId(userId,targetUserId);
                console.log(room)
                let chat = await Chat.findOne({
                    participants:{$all:[userId,targetUserId]}
                })
                if(!chat){
                    chat = new Chat({
                        paricipants:[userId,targetUserId],
                        messages : [],
                    })
                }
                chat.messages.push({
                    senderId : userId,
                    text,
                })
                await chat.save();
                io.to(room).emit("messageReceived",{firstName,text});
            }
            catch(err){
                console.log(err);
            }
        })
        socket.on("disconnect",()=>{

        })
});
}

module.exports = initializeSocket;