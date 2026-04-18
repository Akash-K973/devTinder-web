const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:true,
        minLength:4,
        maxLength:50,
        index:true,
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
    photoURl:{
        type : String,
        default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAARVBMVEX6+vqPj4/////l5eWMjIyIiIj19fWCgoKVlZXGxsaYmJiSkpKxsbG3t7fp6eny8vKkpKS+vr7Nzc2qqqrf39/X19eenp7INw94AAAC6UlEQVR4nO2b27KrIAxAMXLxBqJo//9TD9o9s7trVawYPDNZD20f14RbSChjBEEQBEEQBEEQBEEQxE2BiecnpHZ5AtAOpbZVXVdW94O8gRdA3hSZEJxnGedCZJU2ibUARqu8zitc2TGlFRjL35RmLe7aZFrQiw9KT61UwQItPitNiC6JFbgNJ2+lU1g1m05JrKDbcfJWPbIVDGrPKctUjmslq32njD9QnQIGbx7AEjNUMmDw5lghSoFe2TRThqoNmVFzpPBmFYxBM2q2GrBCtXm+pBo/CFWaxg9tUgWuvTlUSFKQH5BSLZJU+DzHO2p8bndg+JCWH5RHpJBS0EORUlhSd5xTzNxw9d1yn2JQBzvh7ej3PPvGwHTKRypHcrpnPhWaoiPfsoJzdDyl8NsM7nVUPgLmOreYSqE3ZIN9b99PFbAShFerZidWKkWFCrZrQYmqZkxvxEqhlhFegLFeWYOiQLuELq3MomA9wVWTrjo8aeWOv00twR1ysWxpxQYtlOA/CMW7nKVvhDAA02tnPU737Q1aMz9MJlI+vwnifwegNfkXmAvbpTC6IvzK90JdNBcdOytnShhcXdKXhCH7WmnWKi7IQ9tzTt6qil7rAHfSyZ/UTeRQwXDaycfKRJbqYkjFzkZtDKkmrpOsYkhFvpwGdUJJapIq7jh8IQWNXSkXV4qd3zvjr77grvGmVOSbPJQxpCLX0CCPIRX9RP4qu/tLFTt3OdRP+8wFFVBzevzq+L2j03lC9BxhQp6T4ll8pYO9xyUXNZMPNK8+OF1VAgX7tVX0/PwXuf1gccvpKiW2+4xy1enih4zl2iPYdXjsM28BDI8Dbe0JZa+vywIri/BocV70KHVZkGURVurgqiolWmebjbbeCxcXtR1Rq9cAee+m+vnKoAnFXZ/gCT8wmXeuKnxIxG9x3//MiocrDUtV4p/+/GGGsS+1bpyn0V3Zj3nLkv8rBN5Jq0MQBEEQBEEQBEEQBEGs8Q9UMiC2Cz0iwAAAAABJRU5ErkJggg==",
        validate(value){
            if (
            !validator.isURL(value) &&
            !value.startsWith("data:image/")
        ) {
            throw new Error("Invalid photo");
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


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$790",{
                expiresIn:"7d"
            });
            return token;
}

userSchema.methods.validatePassword= async function(passwordInput){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInput,passwordHash);

    return isPasswordValid;
}

module.exports =  mongoose.model("User", userSchema);