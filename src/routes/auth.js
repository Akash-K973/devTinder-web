const express = require("express");
const authRouter = express.Router();
const {validateSignupData} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender
        });
        console.log(user);
        
        const saveUser = await user.save();
        const token = await saveUser.getJWT();
        res.cookie("token",token,{expires:new Date(Date.now()+8*360000)});                            
        res.json({message:"User Added :",data:saveUser});
    } 
    catch (err) {
        console.log(err);
        res.status(400).send("Error in saving user");
    }
});

authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("Email is not valid");
        }
        const isPasswordValid =await user.validatePassword(password);
        
        if(isPasswordValid){ 
            const token = await user.getJWT();

            res.cookie("token",token,{expires:new Date(Date.now()+8*360000)});                            
            res.send(user);
        }
        else{
            throw new Error("Password is not correct")
        }
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("logout success");
})



module.exports = { authRouter };