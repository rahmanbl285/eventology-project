'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Ticket from './tickets';
import { useDispatch, useSelector } from 'react-redux';
import { setTicket } from '@/lib/features/event/ticketSlice';
import { RootState } from '@/lib/features/store';

interface TicketProps {
  eventsId: number;
  id: number;
  type: string;
  availableSeat: number;
  price: number;
  endSaleDate: string;
}

interface TabsEventProps {
  onCountChange: (count: number, ticket: { ticketType: string; ticketCount: number; ticketPrice: number; }) => void  
  description: string;
  tickets: TicketProps[];
  onPriceChange: (newTotalPrice: number) => void;
  onTicketTypesChange: (newTicketTypes: { [key: string]: number }) => void;
}

export default function TabsEvent({
  onCountChange,
  description,
  tickets,
  onPriceChange,
  onTicketTypesChange,
}: TabsEventProps) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [ticketTypes, setTicketTypes] = useState<{ [key: string]: number }>({});
  const [totalTickets, setTotalTickets] = useState(0);
  const [ticketPrice, setTicketPrice] = useState<Record<string, number>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const prevTicketTypes = useRef(ticketTypes);
  const prevTotalPrice = useRef(totalPrice);
  const maxTickets = 4;

  const eventsId = useSelector((state: RootState) => state.ticket.eventId);
  const slug = useSelector((state: RootState) => state.ticket.slugEvent)

  const handleTabClick = (tab: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveTab(tab);
  };

  const handleCountChange = (change: number, ticketId: number) => {
    const selectedTicket = tickets.find((ticket) => ticket.id === ticketId);
  
    if (selectedTicket) {
      const ticketPrice = selectedTicket.price;
      const ticketType = selectedTicket.type;
  
      const newTotalTickets = totalTickets + change;
      const newTotalPrice = totalPrice + change * ticketPrice;
  
      setTotalTickets(newTotalTickets);
      setTotalPrice(newTotalPrice);
      setTicketPrice((prevTicketPrice) => ({
      ...prevTicketPrice,
      [ticketType]: ticketPrice, // Jangan menjumlahkan harga tiket
    }));
      
        
    onCountChange(newTotalTickets, { 
      ticketType, 
      ticketCount: ticketTypes[ticketType], 
      ticketPrice: selectedTicket.price 
    })
    
      onPriceChange(newTotalPrice);
  
      setTicketTypes((prevTicketTypes) => {
        const updatedTypes = { ...prevTicketTypes };
        const newCount = (updatedTypes[ticketType] || 0) + change;
  
        if (newCount > 0) {
          updatedTypes[ticketType] = newCount;
        } else {
          delete updatedTypes[ticketType];
        }
  
        return updatedTypes;
      });
    }
  };
  

  useEffect(() => {
    if (
      JSON.stringify(ticketTypes) !== JSON.stringify(prevTicketTypes.current) ||
      totalPrice !== prevTotalPrice.current
    ) {
      dispatch(
        setTicket({
          eventId: eventsId,
          ticket: Object.keys(ticketTypes).map((ticketType) => ({
            ticketType,
            ticketCount: ticketTypes[ticketType],
            ticketPrice: ticketPrice[ticketType],
          })),
          ticketTotalPrice: totalPrice,
          slugEvent: slug
        })
      );
      
      prevTicketTypes.current = ticketTypes;
      prevTotalPrice.current = totalPrice;
    }
  }, [ticketTypes, totalTickets, ticketPrice, totalPrice, eventsId, dispatch, slug]);

  useEffect(() => {
    if (JSON.stringify(ticketTypes) !== JSON.stringify(prevTicketTypes.current)) {
      onTicketTypesChange(ticketTypes);
    }
    if (totalPrice !== prevTotalPrice.current) {
      onPriceChange(totalPrice);
    }
  }, [ticketTypes, totalPrice, onTicketTypesChange, onPriceChange]);

  return (
    <div className="py-4 w-full">
      <div role="tablist" className="tabs tabs-bordered">
        <Link
          href="#"
          role="tab"
          className={`tab text-white text-md font-bold ${activeTab === 'deskripsi' ? 'tab-active' : ''}`}
          onClick={(e) => handleTabClick('deskripsi', e)}
        >
          DESKRIPSI
        </Link>
        <Link
          href="#"
          role="tab"
          className={`tab text-white text-md font-bold ${activeTab === 'tiket' ? 'tab-active' : ''}`}
          onClick={(e) => handleTabClick('tiket', e)}
        >
          TIKET
        </Link>
      </div>

      <div className="mt-5 px-10 lg:px-5">
        {activeTab === 'deskripsi' && (
          <div className="flex flex-col gap-2">
            <h6 className="font-bold text-xl capitalize font-playball text-gold tracking-wider">
              event description
            </h6>
            <p className="text-justify break-words whitespace-pre-wrap text-white">
              {description}
            </p>
          </div>
        )}
        {activeTab === 'tiket' && (
          <div className="flex flex-col gap-4">
            <h6 className="font-bold text-xl capitalize font-playball text-gold tracking-wider">
              event ticket
            </h6>
            {tickets.map((ticket) => {
              return ( 
              <Ticket
                key={ticket.id}
                onCountChange={(change) => handleCountChange(change, ticket.id)}
                type={ticket.type}
                availableSeat={ticket.availableSeat}
                price={ticket.price}
                endSaleDate={ticket.endSaleDate}
                totalTickets={totalTickets}
                maxTickets={maxTickets} 
                eventsId={ticket.eventsId}              />
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
