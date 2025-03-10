import { Prisma } from "@prisma/client";

export interface EventData {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    slug: string | null;
    totalTransactionPending?: number;
    totalTicketQtyPaid?: number;
    totalPenjualanPaid?: number;
}

export enum Status {
    waitingPayment = "waitingPayment",
    waitingConfirmation = "waitingConfirmation",
    paid = "paid",
    cancelled = "cancelled",
    declined = "declined",
}


export interface TransactionStatus {
    id: number;
    status: Status
}

export type EventGroupBy = {
    eventId: number;
    _sum: {
        quantity: number | null;
        grandTotal: number | null;
    };
};

export type TransactionWithUser = Prisma.TransactionGetPayload<{
    include: { users: true };
  }>;