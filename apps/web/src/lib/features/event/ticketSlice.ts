import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TicketState {
    eventId: number | null;
    ticket: {
      ticketType: string
      ticketCount: number
      ticketPrice: number
    }[]
    ticketTotalPrice: number;
    slugEvent: string
  }
  
  const initialState: TicketState = {
    eventId: null,
    ticket: [],
    ticketTotalPrice: 0,
    slugEvent: ""
  };
  

export const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
      setTicket: (state, action: PayloadAction<TicketState>) => {
        state.eventId = action.payload.eventId;
        state.ticket = action.payload.ticket;
        state.ticketTotalPrice = action.payload.ticketTotalPrice;
        state.slugEvent = action.payload.slugEvent;
        localStorage.setItem("ticketStates", JSON.stringify(state));
      }
    }
  
})

export const { setTicket } = ticketSlice.actions;