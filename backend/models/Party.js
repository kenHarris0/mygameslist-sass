import mongoose from 'mongoose';


const schema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    game:{
        type:String,
        required:true
    },
    Open:{
        type:String,
        enum:["private","public"],
        default:"public"

    },
    limit:{
        type:Number,
        default:4
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
    

},{timestamps:true})

const party=mongoose.models.party || mongoose.model('party',schema)

export default party;