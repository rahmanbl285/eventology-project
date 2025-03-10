'use client';

import { capitalizeWords } from '@/helpers/formatCapitalize';
import { formatDateCard } from '@/helpers/formatDate';
import { GetEventSlug } from '@/lib/event';
import { IEvent } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCalendar, FaClock, FaLocationPin } from 'react-icons/fa6';
import profile from '../../../../../assets/profile.png';
import splitTitle from '@/helpers/formatTitle';
import { defaultBanner } from '@/assets/defaultImage';
import TabsEvent from './tabs';
import CheckoutTicket from './checkout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/features/store';
import { setTicket } from '@/lib/features/event/ticketSlice';
import toast from 'react-hot-toast';

const defaultProfile = profile.src;

export default function EventSlug() {
  const dispatch = useDispatch();
  const [id, setId] = useState<number | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [events, setEvents] = useState<IEvent | undefined>();
  const title = splitTitle(capitalizeWords(events?.title || ''), 40);
  const { eventId, ticket, ticketTotalPrice, slugEvent } = useSelector(
    (state: RootState) => state.ticket,
  );

  const {
    day: startDay,
    month: startMonth,
    year: startYear,
    time: startTime,
  } = formatDateCard(events?.startDate || '', true);
  const {
    day: endDay,
    month: endMonth,
    year: endYear,
    time: endTime,
  } = formatDateCard(events?.endDate || '', true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugParam = window.location.pathname.split('/').pop();
    const idParam = params.get('id');

    if (slugParam) setSlug(slugParam);
    if (idParam) setId(Number(idParam));
  }, []);

  useEffect(() => {
    if (!id || !slug) return;

    const fetchEventSlug = async () => {
      try {
        const data = await GetEventSlug(id, slug);
        setEvents(data.event);
        if (data.event?.Tickets) {
          const prices = data.event.Tickets.map((ticket: any) => ticket.price);
          const validPrices = prices.filter((price: any) => price != null);
          const minPrice =
            validPrices.length > 0 ? Math.min(...validPrices) : 0;

          dispatch(
            setTicket({
              eventId: id,
              ticket: [],
              ticketTotalPrice: minPrice,
              slugEvent: slug,
            }),
          );
        }
      } catch (error) {
        toast.error('error', error!);
        console.error(error);
      }
    };

    fetchEventSlug();
  }, [id, slug, dispatch]);

  const handleTicketCountChange = (
    newTicketCount: number,
    ticket: { ticketType: string; ticketCount: number; ticketPrice: number },
  ) => {
    const existingTickets = ticket;
    const newTickets = [
      ...[existingTickets],
      {
        ticketType: ticket.ticketType,
        ticketCount: newTicketCount,
        ticketPrice: ticket.ticketPrice,
      },
    ];
    dispatch(
      setTicket({
        eventId,
        ticket: newTickets,
        ticketTotalPrice: newTickets.reduce(
          (acc, curr) => acc + curr.ticketCount * curr.ticketPrice,
          0,
        ),
        slugEvent,
      }),
    );
  };

  const handleTicketTypesChange = (newTicketTypes: {
    [key: string]: number;
  }) => {
    dispatch(
      setTicket({
        eventId,
        ticket: Object.keys(newTicketTypes).map((ticketType) => ({
          ticketType,
          ticketCount: newTicketTypes[ticketType],
          ticketPrice: 0,
        })),
        ticketTotalPrice: 0,
        slugEvent,
      }),
    );
  };

  return (
    <div className="flex flex-col lg:px-10 lg:gap-10 place-items-center w-full bg-black pt-20">
      <div className="grid lg:grid-cols-[1fr_0.5fr] lg:max-w-[1120px] w-full lg:gap-10 items-end">
        <div className="flex flex-col gap-2">
          <div className="breadcrumbs px-5 lg:px-0">
            <ul>
              <li>
                <Link
                  className="text-white text-xs tracking-wider"
                  href={'/explore'}
                >
                  Explore
                </Link>
              </li>
              <li className="text-white">
                <p className="text-white text-xs tracking-wider">
                  {events?.category}
                </p>
              </li>
              <li className="text-white">
                <p className="text-white text-xs tracking-wider">{title}</p>
              </li>
            </ul>
          </div>
          <Image
            src={events?.image || defaultBanner()}
            alt={events?.title || ''}
            height={1000}
            width={500}
            className="object-cover lg:rounded-md w-full h-80"
            priority
          />
        </div>
        <div className="lg:card flex flex-col lg:rounded-md w-full gap-5 h-80 p-6 bg-black lg:bg-white">
          <div className="card-body p-0 px-4">
            <p className="text-gold text-lg font-bold font-playball tracking-wider">
              {title}
            </p>
            <p className="lg:text-black text-white inline-flex gap-3">
              <FaCalendar className="text-lg fill-white lg:fill-black" />
              {startDay} {startMonth} {startYear} - {endDay} {endMonth}{' '}
              {endYear}
            </p>
            <p className="lg:text-black text-white inline-flex gap-3">
              <FaClock className="text-lg fill-white lg:fill-black" />
              {startTime} - {endTime}
            </p>
            <p className="lg:text-black text-white inline-flex gap-3">
              <FaLocationPin className="text-lg fill-white lg:fill-black" />
              {events?.address}, {capitalizeWords(events?.city || '')}
            </p>
          </div>
          <hr className="lg:text-black text-white " />
          <div className="flex flex-1 gap-5 px-4">
            <Image
              src={events?.users.image || defaultProfile}
              alt="profile"
              width={300}
              height={300}
              className="object-cover rounded-full w-14 h-14"
              priority
            />
            <div className="flex flex-col gap-1 h-full self-center justify-center">
              <p className="lg:text-black text-white ">diselenggarakan oleh:</p>
              <p className="lg:text-black text-white ">{events?.users.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_0.5fr] max-w-[1120px] w-full gap-10">
        <div className="flex max-w-full gap-3 justify-center pb-5 text-white">
          <TabsEvent
            onCountChange={(
              newTicketCount: number,
              ticket: {
                ticketType: string;
                ticketCount: number;
                ticketPrice: number;
              },
            ) => handleTicketCountChange(newTicketCount, ticket)}
            description={events?.description || ''}
            tickets={events?.Tickets || []}
            onPriceChange={(price) =>
              handleTicketCountChange(price, {
                ticketType: '',
                ticketCount: 0,
                ticketPrice: 0,
              })
            }
            onTicketTypesChange={handleTicketTypesChange}
          />
        </div>
        <div>
          {events?.Tickets ? <CheckoutTicket /> : <p>Loading tickets...</p>}
        </div>
      </div>
    </div>
  );
}
