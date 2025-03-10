'use client'

import { useEffect, useState } from "react";
import CardDashboard from "./_components/dashboard/card";
import { GetEventByOrganizer } from "@/lib/event";
import { GetEventOrderSummary } from "@/lib/transaction";


export default function Dashboard () {
    const [events, setEvents] = useState<any>()
    const [orderSum, setOrderSum] = useState<any>()

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [eventData, orderData] = await Promise.all([
            GetEventByOrganizer(),
            GetEventOrderSummary()
          ]);
          setEvents(eventData);
          setOrderSum(orderData);   
        } catch (err) {
          console.error('Error Fetching Data: ', err);
        }
      };
    
      fetchData();
    }, []);

    console.log('order sum', orderSum);
    
        
    return (
        <div className="flex flex-col p-5 bg-black">
            <div className="w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <CardDashboard title={"Event Aktif"} num={events?.activeEvent} ket={"Event"}/>
                <CardDashboard title={"Total Transaksi"} num={orderSum?.totalSuccessTransaction} ket={"Transaksi"}/>
                <CardDashboard title={"Total Tiket Terjual"} num={orderSum?.totalTicketTerjual} ket={"Tiket"}/>
                <CardDashboard title={"Total Penjualan"} num={orderSum?.totalPenjualan} ket={""}/>
            </div>
            </div>
        </div>
    )
}