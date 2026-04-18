const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
      type:String,
      enum:{
        values:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is incorrect status type`
      }
    },
    text:{
        type:String,
        default:"No message"
    }
},{
    timestamps:true,
})

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function (){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request itself");
    }
})  

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",connectionRequestSchema
)

module.exports = ConnectionRequestModel;