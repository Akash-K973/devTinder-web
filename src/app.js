const express = require('express');

const app = express();

//This req will match for onle "GET" http method API calls 
app.get("/user",(req,res)=>{
    res.send({"Firstname":"Akash","Lastname":"K"})
})

// Post method
app.post("/user",(req,res)=>{
    res.send("Save success");
})

app.delete("/user",(req,res)=>{
    res.send("Delete success")
})


// This req will match for all thw http method API calls 
app.use("/test",(req,res)=>{
    res.send("Hello World!");
})


app.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});
            
