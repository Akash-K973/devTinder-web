const express = require("express");
const userRouter = express.Router();


const { userAuth } = require("../middlewares/auth");
const User = require("../models/user")
const connectionRequest = require('../models/connectionRequest');
const { isAbaRouting } = require("validator");

userRouter.get("/user/request/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoURl","age","skills","about","gender"]);

        res.json({message:"Data fetched",
            data:connectionRequests,
        })
    }

    catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",["firstName","lastName","photoURl","age","skills","about","gender"]).populate("toUserId",["firstName","lastName","photoURl","age","skills","about","gender"]);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
            })

        res.json({data})  
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
})

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        const skip = (page-1)*limit;
        const connectionRequests = await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
           $and:[ {_id : {$nin : Array.from(hideUsersFromFeed)}},
            {_id : {$ne : loggedInUser._id}}
           ],
        }).select("firstName lastName photoURl age skills gender").skip(skip).limit(limit);
        console.log({data:users})
        res.send({data:users});
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
})

module.exports = {userRouter};