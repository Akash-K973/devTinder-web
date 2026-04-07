const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password : {
        type : String ,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is Weak!");
            }
        }
    },
    age : {
        type : Number,
        min : 18,
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    },
    photoUrl:{
        type : String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo")
            }
        }
    },
    about:{
        type:String,
        default:"this user has no about"
    },
    skills:{
        type : [String],
    }
},{
    timestamps:true,
}
);

module.exports =  mongoose.model("User", userSchema);