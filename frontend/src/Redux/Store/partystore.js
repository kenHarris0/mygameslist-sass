import {configureStore} from '@reduxjs/toolkit'

import Partyreducer from '../Slices/PartySlice'


export const partystore=configureStore({
    reducer:{
        party:Partyreducer
    }
})

