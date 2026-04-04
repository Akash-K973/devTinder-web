const express = require('express');

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin",adminAuth);

app.use("/user/login",(req,res)=>{
    res.send("login successfull");
})

app.get("/user",userAuth,(req,res)=>{
    res.send("user data send");
})

app.get("/admin/getAllData",(req,res)=>{
    res.send("AllDatesend")
})

app.get("/admin/deleteAllData",(req,res)=>{
    res.send("AllDateDelete");
})

app.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});