import {createSlice} from "@reduxjs/toolkit"

const partySlice=createSlice({
    name:"party",
    initialState:{
        parties:[],
        loading:false,

    },
    reducers:{
        getallparties:(state,action)=>{
            state.parties=action.payload
        },
       
        deleteparty:(state,action)=>{
            state.parties=state.parties.filter(party=>party._id.toString()!==action.payload.toString())

        },
        updatePartyNewJoin:(state,action)=>{
            const updatedparty=action.payload

            const index=state.parties.findIndex(party=>party._id.toString()===updatedparty._id.toString())

            if(index!==-1){
                state.parties[index]=updatedparty
            }
        }
    }
})

export const {getallparties,deleteparty,updatePartyNewJoin}=partySlice.actions
export default partySlice.reducer