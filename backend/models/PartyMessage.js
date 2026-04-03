import mongoose from 'mongoose';


const schema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    groupId:{
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

const grpmessage=mongoose.models.grpmessage || mongoose.model('grpmessage',schema)

export default grpmessage;