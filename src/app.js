const express = require('express');
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user")

app.post("/signup",async (req,res)=>{
    const user = new User({
        firstName : "Sparrow",
        lastName : "K",
        emailId : "akashka973gmail.com",
        password : "Mcet@12345",
        age : "23",
        gender : "male",
    });
    try{
        await user.save();
        res.send("user Saved!")
    }
    catch(err){
        res.status(400).res("Error in saving user")
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
