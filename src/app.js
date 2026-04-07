const express = require('express');
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user")
const {validateSingupData} = require("./utils/validation")
const bcrypt = require("bcrypt")

app.use(express.json());

app.post("/signup",async (req,res)=>{
    try{
        validateSingupData(req.body);
        const {password} = req.body;
        const passwordHash =await bcrypt.hash(password,10)
        const user = new User({
            firstName,lastName,emailId,password:passwordHash,age,gender
        });
        await user.save();
        res.send("user Saved!")
    }
    catch(err){
        res.status(400).send("Error in saving user")
    }
});

app.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Email is not valid");
        }
        const isPasswordValid = await bcrypt.compare(password);
        if(isPasswordValid){
            res.send("Login success!")
        }
        else{
            throw new Error("Password is not correct")
        }
    }
    catch(err){
        res.status(400).send("Error in saving user")
    }
})

app.get("/user",async(req,res)=>{
    const email = req.body.emailId;
   try{
     const user = await User.find({emailId : email});
     if(user.length==0){
        res.status(400).send("User not found");
     }
     else{
     res.send(user);
     }
   }
   catch(err){
    res.status(400).send("Something wrong");
   }
})

app.get("/feed",async(req,res)=>{
    const users = await User.find({});
    res.send(users);
});

app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfull");
    }
    catch(err){
    res.status(400).send("Something wrong");
   }
})

app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
   
    try{
         const ALLOWED_UPDATE=[
        "photoUrl","about","gender","age","skills"
    ]

    const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATE.includes(k));
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }
        const user = await User.findByIdAndUpdate({_id:userId},data);
        res.send("User updated success!")
    }
    catch(err){
        res.status(400).send("Error saving user")
    }
});

connectDb().then(()=>{
    console.log("Database connected");
    app.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});
})
.catch((err)=>{
    console.log("Database cannot connected");
})
