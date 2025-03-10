import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user/userSlice";
import { ticketSlice } from "./event/ticketSlice";
import { detailTransaction } from "./transaction/detailTransactionSlice";

const rootReducer = combineReducers({
    user: userSlice.reducer,
    ticket: ticketSlice.reducer,
    transaction: detailTransaction.reducer
})
export type RootState = ReturnType<typeof rootReducer>
export const makeStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>