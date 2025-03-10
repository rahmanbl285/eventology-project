'use client';

import { formatDateCard } from '@/helpers/formatDate';
import { formatToIDR } from '@/helpers/formatPrice';
import { ITicketDetail } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineEventSeat } from 'react-icons/md';

export default function Ticket({
  onCountChange,
  type,
  availableSeat,
  price,
  endSaleDate,
  totalTickets,
  maxTickets,
  eventsId
}: ITicketDetail & { totalTickets: number; maxTickets: number; eventsId: number }) {
  const [count, setCount] = useState(0);
  const { day, month, year } = formatDateCard(endSaleDate, true);

  const handleInc = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  
    if (totalTickets >= maxTickets) {
      toast.error('Maksimal memesan 4 tiket!');
      return;
    }
  
    if (count >= availableSeat) {
      toast.error('Jumlah tiket melebihi kursi yang tersedia!');
      return;
    }
  
    const newCount = count + 1;
    setCount(newCount);
    onCountChange(newCount - count, eventsId);
  };
  

  const handleDec = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange(newCount - count, eventsId);
    }
  };

  return (
    <div className="flex flex-col w-full h-fit p-5 border rounded-md border-white bg-white gap-3">
      <div className="flex flex-col gap-2">
        <h6 className="text-lg font-roboto text-black tracking-wider font-bold">{type}</h6>
        <p className="text-gold">
          Berakhir {day} {month} {year}
        </p>
        <p className="text-black">price include tax and admin</p>
        <p className="inline-flex gap-1 text-black">
          <MdOutlineEventSeat className="text-xl" />
          Available Seats: {availableSeat}
        </p>
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <hr className="text-black" />
          <div className="flex justify-between">
            <p className="font-bold py-1 text-black">{formatToIDR(price)}</p>
            
            { new Date(endSaleDate) > new Date() ?
              availableSeat === 0 ? (
                <h1 className='font-extrabold tracking-wider text-gold self-center'>SOLD OUT</h1>
              ) : (
                <div className="inline-flex">
              <button

                onClick={handleDec}
                className="px-3 text-black py-1 border rounded-full"
              >
                -
              </button>

              <p className="text-black px-3 py-1">{count}</p>
              <button

                onClick={handleInc}
                className={`px-3 text-black py-1 border rounded-full ${
                  totalTickets >= maxTickets ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                +
              </button>
            </div>
              ) : (
                <h1 className='font-extrabold tracking-wider text-gold self-center'>SALE ENDED</h1>
              )
            }
            
          </div>
        </div>
      </div>
    </div>
  );
}
