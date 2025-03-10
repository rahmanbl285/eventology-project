'use client';

import { useEffect, useState } from 'react';
import Tabs from '../_components/tabs';
import { GetUserOrderSummary } from '@/lib/transaction';
import { formatDateCard } from '@/helpers/formatDate';
import { formatToIDR } from '@/helpers/formatPrice';

export default function TicketDashboard() {
  const [statusTab, setStatusTab] = useState<'paid' | 'cancelled'>('paid');
  const [paidTickets, setPaidTickets] = useState<any[]>([]);
  const [cancelledTickets, setCancelledTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await GetUserOrderSummary();
      if (data?.transactions) {
        setPaidTickets(data.transactions.success);
        setCancelledTickets(data.transactions.failed);
      }
    };
    fetchOrder();
  }, []);
  

  return (
    <div className="p-5 bg-black text-white">
      <Tabs
        activeTab={statusTab}
        setActiveTab={(tab) => setStatusTab(tab as 'paid' | 'cancelled')}
        tabs={[
          { key: 'paid', label: 'Paid Ticket' },
          { key: 'cancelled', label: 'Cancelled Ticket' },
        ]}
      />
      <div className='overflow-x-auto'>
        <table className='table table-xs'>
          <thead className='text-white'>
            <tr>
              <th>Nama Event</th>
              <th>Jumlah Tiket</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal Pembelian</th>
            </tr>
          </thead>
          <tbody>
            {(statusTab === 'paid' ? paidTickets : cancelledTickets).map(
              (ticket, index) => {
                const { day, month, year } = formatDateCard(ticket.createdAt, true)
                return (
                <tr key={index}>
                  <td>{ticket.events.title}</td>
                  <td>{ticket.quantity}</td>
                  <td>{formatToIDR(ticket.total)}</td>
                  <td
                    className={
                      ticket.status === 'paid'
                        ? 'text-gold'
                        : 'text-grey'
                    }
                  >
                    {ticket.status}
                  </td>
                  <td>
                    {day} {month} {year}
                  </td>
                </tr>
              )},
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
