'use client';

import Image from 'next/image';
import TitleCard from './title';
import { useEffect, useState } from 'react';
import { IEvent } from '@/types';
import Link from 'next/link';
import { GetTopEventsAllTime } from '@/lib/event';

export default function Top3AllTime() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await GetTopEventsAllTime();
      setEvents(data.topEvents);
    };
    fetchEvent();
  }, []);

  return (
    <>
  <div className="flex flex-col gap-5">
    <div className="flex pt-10">
      <TitleCard title={"Eventology"} subtitle={'Top 3'} />
    </div>

    <div className="w-full rounded-lg h-fit pl-3 overflow-x-auto">
      <div className="flex flex-row gap-5 md:justify-evenly w-max">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex gap-4 flex-shrink-0 w-[400px]" 
          >
            <div className="flex justify-center items-center w-[60px]">
              <h1 className="text-7xl text-white font-extrabold font-roboto">
                {idx + 1}
              </h1>
            </div>

            <div className="flex items-stretch p-5 max-h-56 w-full">
              <Link href={`/events/${event.slug}?id=${event.id}`}>
                <Image
                  width={500}
                  height={250}
                  className="object-cover w-full h-full brightness-75"
                  src={event.image}
                  alt={event.title}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</>

  );
}
