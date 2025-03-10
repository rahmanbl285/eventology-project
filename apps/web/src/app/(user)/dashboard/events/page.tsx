'use client';

import { useState, useEffect } from 'react';
import { formatDateCard } from '@/helpers/formatDate';
import { formatToIDR } from '@/helpers/formatPrice';
import { IoFilter } from 'react-icons/io5';
import Link from 'next/link';
import { GetEventOrderSummary } from '@/lib/transaction';
import Tabs from '../_components/tabs';

export default function EventDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'nonactive'>('active');  
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [nonActiveEvents, setNonActiveEvents] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'nearest' | 'farthest'>('nearest');

  useEffect(() => {
    const fetchEvent = async () => {
        const data = await GetEventOrderSummary();
        setActiveEvents(data?.activeEvents || []);
        setNonActiveEvents(data?.nonActiveEvents || []);

    };
    fetchEvent();
  }, []);

  const displayedEvents =
    activeTab === 'active' ? activeEvents : nonActiveEvents;

  const sortByDateField = activeTab === 'active' ? 'startDate' : 'endDate';

  const sortedEvents = [...displayedEvents].sort((a, b) => {
    const dateA = new Date(a[sortByDateField]).getTime();
    const dateB = new Date(b[sortByDateField]).getTime();

    return sortOrder === 'nearest' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="p-5 bg-black text-white">
      <Tabs
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "active" | "nonactive")}
        tabs={[
          { key: 'active', label: 'Active Event' },
          { key: 'nonactive', label: 'Non-Active Event' },
        ]}
      />

      <div className="flex justify-end mb-2">
        <div className="relative">
          <IoFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-lg" />
          <select
            className="select select-xs select-bordered bg-black rounded-sm text-white pl-8"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'nearest' | 'farthest')
            }
          >
            <option value="nearest">Terdekat</option>
            <option value="farthest">Terjauh</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead className="text-white">
            <tr>
              <th>Nama Event</th>
              <th>
                {activeTab === 'active' ? 'Tanggal Mulai' : 'Tanggal Berakhir'}
              </th>
              <th>Tiket Terjual</th>
              <th>Order Pending</th>
              <th>Pendapatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event: any) => {
                const formattedDate = formatDateCard(
                  event[sortByDateField],
                  true,
                );
                
                return (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>
                      {formattedDate.day} {formattedDate.month}{' '}
                      {formattedDate.year}
                    </td>
                    <td>{event.totalTicketQtyPaid || 0}</td>
                    <td>{event.totalTransactionPending || 0}</td>
                    <td>{formatToIDR(event.totalPenjualanPaid || 0)}</td>
                    <td className='py-2'>
                      <Link
                        href={`/dashboard/events/${event.slug}`}
                        className="py-2 px-3 text-gold underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  Tidak ada event{' '}
                  {activeTab === 'active' ? 'aktif' : 'non-aktif'}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
