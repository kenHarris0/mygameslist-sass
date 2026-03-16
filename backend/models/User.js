import mongoose from "mongoose";

const schema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
    }
},{
    timestamps:true
});


const User=mongoose.models.user || mongoose.model("user",schema);

export default User;