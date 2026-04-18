const express = require('express');
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require ("cors");
const ConnectionRequest = require("./models/connectionRequest")
const {userAuth} = require("./middlewares/auth")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/requests");
const {userRouter} = require("./routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);




connectDb().then(()=>{
    console.log("Database connected");
    app.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});
})
.catch((err)=>{
    console.log("Database cannot connected");
})
