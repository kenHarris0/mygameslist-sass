import {configureStore} from '@reduxjs/toolkit'

import Partyreducer from '../Slices/PartySlice'
import partymessagereducer from '../Slices/PartymsgSlice'

export const partystore=configureStore({
    reducer:{
        party:Partyreducer,
        partymessage:partymessagereducer
    }
})

