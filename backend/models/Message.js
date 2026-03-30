import mongoose from 'mongoose';


const schema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    text:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:null
        
    },
    reaction:[
        {
            from:{
                 type:mongoose.Schema.Types.ObjectId,
        ref:'user'
            },
            emoji:{
                type:String
            }

        }
    ]
},{timestamps:true})

const message=mongoose.models.message || mongoose.model('message',schema)

export default message;