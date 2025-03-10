'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetEvent } from '@/lib/event';
import { IEvent } from '@/types';
import { formatDateCard } from '@/helpers/formatDate';

export default function SlidesHero() {
  const [events, setEvents] = useState<IEvent[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data: IEvent[] = await GetEvent(); 
        const upcomingEvents = data
          .filter((event: IEvent) => new Date(event.startDate) >= new Date())
          .sort((a: IEvent, b: IEvent) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) 
          .slice(0, 4); 
  
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvent();
  }, []);
  
  useEffect(() => {
    if (events.length === 0) return; 
  
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);
  
    return () => clearInterval(interval);
  }, [events]);
  
  return (
    <>
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
        }}
      >
        {events.map(event => {
          const { day, month, year } = formatDateCard(event.startDate, true); 

          return (
              <div
              key={event.id}
                className="flex-shrink-0 w-full h-lvh relative bg-cover"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), #141414), url(${event.image})`,
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-50">
                  <div className="flex flex-col w-[400px] gap-1 px-5 md:px-0">
                    <div className="flex justify-between uppercase">
                      <p className="text-white text-xs">eventology</p>
                      <p className="text-white font-bold text-xs">concert</p>
                      <p className="text-white text-xs">A-Z</p>
                    </div>
                    <div className="flex justify-around items-center">
                      <h3 className="text-white text-xl font-bold tracking-wider">
                        STARTS SOON
                      </h3>
                      <h1 className="text-white text-xl font-bold uppercase">
                        {day} {month} {year}
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-white uppercase tracking-widest text-center text-5xl md:text-6xl font-extrabold">
                        {event.title}
                      </h1>
                      <h3 className="text-white tracking-widest uppercase text-center text-xl md:text-2xl font-bold">
                        {event.city}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-white uppercase">
                        Grab your tickets now!
                      </h3>
                      <Link
                        href={`/events/${event.slug}?id=${event.id}`}
                        className="bg-transparent px-2 py-1 border border-white text-white uppercase"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            
          )

        })}
      </div>
    </>
  );
}
