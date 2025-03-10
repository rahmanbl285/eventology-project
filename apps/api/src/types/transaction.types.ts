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

