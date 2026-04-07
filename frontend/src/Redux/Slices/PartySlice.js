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
            state.parties=state.parties.filter(party=>party?._id.toString()!==action.payload?.toString())

        },
        updatePartyNewJoin: (state, action) => {
  const updatedparty = action.payload;

  state.parties = state.parties.map(party =>
    party._id.toString() === updatedparty._id.toString()
      ? updatedparty
      : party
  );
},

        newpartycreated: (state, action) => {
    const newparty = action.payload;

    const exists = state.parties.some(
        party => party._id.toString() === newparty._id.toString()
    );

    if (!exists) {
        state.parties.push(newparty);
    }
},

        
    }
})

export const {getallparties,deleteparty,updatePartyNewJoin,newpartycreated}=partySlice.actions
export default partySlice.reducer