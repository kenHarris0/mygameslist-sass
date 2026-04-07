import mongoose from "mongoose";

const schema=mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
    },
    bio:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    currentlyPlaying:{
        type:String,
        default:""
    },
    prevPlayed:{
        type:String,
        default:""
    },
    prevPlayingTime:{
        type:Number,
        default:0
    },

    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    games:[
        {
        game:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"game"
        },
        totalTimePlayed:{
            type:Number,
            default:0
        },
        startTime:{
            type:Date,
            default:null
        },
        status:{
            type:String,
            enum:["Completed","Playing","Away"],
            default:"Completed"
        }
    }
    ]
},{
    timestamps:true
});


const User=mongoose.models.user || mongoose.model("user",schema);

export default User;