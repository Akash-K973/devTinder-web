const express = require('express');

const app = express();

app.use("/test2",(req,res)=>{
    res.send("Hello from Devtinder!");
})

app.use("/hello",(req,res)=>{
    res.send("Hello!");
})

app.use("/test",(req,res)=>{
    res.send("Hello World!");
})

app.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});

