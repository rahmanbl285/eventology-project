import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface DetailTransactionState {
    grandTotal: number
}

const initialState: DetailTransactionState = {
    grandTotal: 0
}

export const detailTransaction = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        setTransaction: (state, action: PayloadAction<DetailTransactionState>) => {
            state.grandTotal = action.payload.grandTotal
            localStorage.setItem('transactionState', JSON.stringify(state))
        }
    }
})

export const { setTransaction } = detailTransaction.actions