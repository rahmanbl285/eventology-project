'use client';

import Card from '@/components/card';
import TitleCard from './title';
import { useEffect, useState } from 'react';
import { GetEvent } from '@/lib/event';
import { IEvent } from '@/types';

export default function CardLoc() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await GetEvent();
      const filteredEvents = data.filter(
        (event: IEvent) => event.city.toLowerCase().includes('jakarta'), // Cek apakah mengandung kata "jakarta"
      );
      setEvents(filteredEvents);
    };
    fetchEvent();
  }, []);

  return (
    <>
      <TitleCard title={'Popular in'} subtitle={'Jakarta'} />
      <div className="overflow-x-auto w-full">
        <div className="flex gap-4 p-4">
          {events.map((event) => (
            <div key={event.id} className="w-72 flex-shrink-0">
              <Card
                key={event.id}
                image={event.image}
                title={event.title}
                startDate={event.startDate}
                price={
                  event.Tickets.length > 0
                    ? event.Tickets.length > 1
                      ? Math.min(...event.Tickets.map((ticket) => ticket.price))
                      : event.Tickets[0].price
                    : 0
                }
                city={event.city}
                slug={event.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
