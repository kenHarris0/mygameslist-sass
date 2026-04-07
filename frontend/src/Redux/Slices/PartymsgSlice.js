import {createSlice} from "@reduxjs/toolkit"


const partymessageSlice=createSlice({
    name:"partymessage",
    initialState:{
        partymessages:[]
    },
    reducers:{
        getallpartymessages:(state,action)=>{
            state.partymessages=action.payload
        },
        updatepartymessage:(state,action)=>{
            const newmsg=action.payload
            const exists=state.partymessages.some(msg=>msg?._id?.toString()===newmsg?._id.toString())
            if(!exists){
                state.partymessages.push(newmsg)
            }
        }
    }
})


export const {getallpartymessages,updatepartymessage}=partymessageSlice.actions
export default partymessageSlice.reducer