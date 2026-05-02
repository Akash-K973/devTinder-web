const express = require('express');
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require ("cors");
const ConnectionRequest = require("./models/connectionRequest")
const {userAuth} = require("./middlewares/auth")
const http = require("http");


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/requests");
const {userRouter} = require("./routes/user");
const initializeSocket = require('./utils/socket');
const { chatRouter } = require('./routes/chat');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDb().then(()=>{
    console.log("Database connected");
    server.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});
})
.catch((err)=>{
    console.log("Database cannot connected");
})
