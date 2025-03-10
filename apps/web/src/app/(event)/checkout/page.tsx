'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/features/store';
import { useEffect, useState } from 'react';
import { setTicket } from '@/lib/features/event/ticketSlice';
import { usePathname, useRouter } from 'next/navigation';
import { formatToIDR } from '@/helpers/formatPrice';
import { GetEventSlug } from '@/lib/event';
import {  IEvent } from '@/types';
import Image from 'next/image';
import { FaCalendar, FaClock, FaCoins, FaLocationPin } from 'react-icons/fa6';
import { formatDateCard } from '@/helpers/formatDate';
import { capitalizeWords } from '@/helpers/formatCapitalize';
import { IoTicketSharp } from 'react-icons/io5';
import splitTitle from '@/helpers/formatTitle';
import { GetUserProfile } from '@/lib/user';
import { BsTicketFill } from 'react-icons/bs';
import { Field, Form, Formik } from 'formik';
import { CreateOrder } from '@/lib/transaction';
import toast from 'react-hot-toast';
import { CreateOrderSchema } from '@/lib/validationSchema';

const SESSION_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export default function CheckoutPage() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [event, setEvent] = useState<IEvent | undefined>();
  const [profile, setProfile] = useState<any>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const { eventId, ticket, ticketTotalPrice, slugEvent } = useSelector(
    (state: RootState) => state.ticket,
  );
  const {
    day: startDay,
    month: startMonth,
    year: startYear,
    time: startTime,
  } = formatDateCard(event?.startDate || '', true);
  const {
    day: endDay,
    month: endMonth,
    year: endYear,
    time: endTime,
  } = formatDateCard(event?.endDate || '', true);
  const queryParams = new URLSearchParams({
    slugEvent,
    eventsId: String(eventId),
    ticket: JSON.stringify(ticket),
    ticketTotalPrice: String(ticketTotalPrice),
  }).toString();

  useEffect(() => {
    if (pathname === '/checkout') {
      const savedState = localStorage.getItem('ticketStates');
      const savedTimestamp = localStorage.getItem('ticketStateTimestamp');
      const currentTime = Date.now();

      if (savedState && savedTimestamp) {
        const timestamp = Number(savedTimestamp);
        const timePassed = currentTime - timestamp;

        if (timePassed > SESSION_EXPIRATION_TIME) {
          // Jika data sudah kedaluwarsa, hapus dari localStorage
          localStorage.removeItem('ticketStates');
          localStorage.removeItem('ticketStateTimestamp');
        } else {
          const parsedState = JSON.parse(savedState);
          if (
            parsedState.eventId !== eventId ||
            JSON.stringify(parsedState.ticket) !== JSON.stringify(ticket) ||
            parsedState.ticketTotalPrice !== ticketTotalPrice ||
            parsedState.slugEvent !== slugEvent
          ) {
            dispatch(setTicket(parsedState));
          }
        }
      } else {
        // Simpan state hanya jika data berubah
        const newState = { eventId, ticket, ticketTotalPrice, slugEvent };
        localStorage.setItem('ticketStates', JSON.stringify(newState));
        localStorage.setItem('ticketStateTimestamp', currentTime.toString());
      }
    }

    // Gunakan router.replace agar tidak menambah history baru
    if (!window.location.search) {
      router.replace(`/checkout?${queryParams}`);
    }
  }, [
    pathname,
    eventId,
    ticket,
    ticketTotalPrice,
    slugEvent,
    router,
    dispatch,
  ]);

  useEffect(() => {
    const fetchEventSlug = async () => {
      try {
        const data = await GetEventSlug(eventId!, slugEvent);
        setEvent(data.event);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEventSlug();
  }, [eventId, slugEvent]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await GetUserProfile();
        setProfile(data);
        console.log('data', data);

        const totalPoint = data.Points.reduce(
          (acc: number, point: any) => acc + point.amount,
          0,
        );
        setTotalPoints(totalPoint);
      } catch (err) {
        console.error('Error Fetching Profile: ', err);
      }
    };
    fetchProfile();
  }, []);

  const initialValues = {
    eventsId: eventId,
    tickets: ticket.map((tiket) => ({
      type: tiket.ticketType,
      quantity: tiket.ticketCount,
      price: tiket.ticketPrice,
    })),

    usedDiscount: 0,
    usedPoint: 0,
  };

  const onCreateOrder = async (data: any): Promise<string[]> => {
    try {
      const res = await CreateOrder(data);

      console.log('Create Order Response:', res);

      if (res.status === 'OK' && Array.isArray(res.transactionIds)) {
        toast.success('Order successfully created!');
        return res.transactionIds; // Kembalikan transactionIds
      } else {
        toast.error(res.message || 'Failed to create order');
        return [];
      }
    } catch (err) {
      console.error('Create Order Error:', err);
      toast.error('Something went wrong');
      return [];
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreateOrderSchema}
      onSubmit={async (values, action) => {
        const transactionIds = await onCreateOrder(values);

        if (transactionIds.length > 0) {
          router.push(`/checkout/payment/${transactionIds.join('-')}`);
        }
      }}
    >
      {({ values, setFieldValue, errors }) => {
        const calculateGrandTotal = (
          ticketTotalPrice: number,
          usedDiscount: number,
          usedPoint: number,
        ) => {
          const discountAmount = (ticketTotalPrice * usedDiscount) / 100;
          const grandTotal = ticketTotalPrice - discountAmount - usedPoint;

          return Math.max(grandTotal, 0);
        };

        const grandTotal = calculateGrandTotal(
          ticketTotalPrice,
          values.usedDiscount,
          values.usedPoint,
        );

        return (
          <Form>
            <div className="flex flex-col lg:px-10 lg:gap-10 place-items-center w-full bg-black ">
              <div className="lg:card card-compact w-full items-center">
                <div className="flex flex-col p-5 ">
                  <h6 className="tracking-widest text-3xl playball-regular text-white  pb-3">
                    Order <span className="text-gold">Details</span>
                  </h6>
                  <div className="flex flex-col sm:flex-row w-full items-center gap-5 bg-white p-3">
                    <div className="max-h-48 max-w-full">
                      <Image
                        src={event?.image || ''}
                        alt={event?.title || ''}
                        height={200}
                        width={400}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-gold uppercase font-bold tracking-wider">
                        {splitTitle(event?.title || '', 28)}
                      </p>
                      <p className="text-black inline-flex gap-3">
                        <FaCalendar className="text-lg fill-black" />
                        {startDay} {startMonth} {startYear} - {endDay}{' '}
                        {endMonth} {endYear}
                      </p>
                      <p className="text-black inline-flex gap-3">
                        <FaClock className="text-lg fill-black" />
                        {startTime} - {endTime}
                      </p>
                      <p className="text-black inline-flex gap-3">
                        <FaLocationPin className="text-lg fill-black" />
                        {event?.address}, {capitalizeWords(event?.city || '')}
                      </p>
                      <Field type="hidden" name="eventsId" value={eventId} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-white p-3">
                    <table>
                      <thead className="pb-2">
                        <tr className="tracking-wider">
                          <th className="text-left">Ticket Type</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(ticket || {}).map(
                          ([ticketType, tiket], index) => (
                            <tr key={ticketType}>
                              {/* Type */}
                              <td className="inline-flex gap-3 w-full items-center pt-2">
                                <IoTicketSharp className="fill-gold text-2xl" />
                                <Field
                                  type="text"
                                  name={`tickets[${index}][type]`}
                                  value={tiket.ticketType}
                                  className="w-full  flex-wrap truncate focus:outline-none"
                                  readOnly
                                />
                              </td>

                              {/* Price */}
                              <td className="text-right">
                                <Field
                                  type="text"
                                  name={`tickets[${index}][price]`}
                                  value={formatToIDR(tiket.ticketPrice)}
                                  className="text-right max-w-full focus:outline-none"
                                  readOnly
                                />
                              </td>

                              {/* Quantity */}
                              <td className="text-right">
                                <Field
                                  type="number"
                                  name={`tickets[${index}][quantity]`}
                                  value={tiket.ticketCount}
                                  readOnly
                                  className="text-right max-w-8 focus:outline-none"
                                />
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-white p-5 text-end">
                    <p className="text-grey inline-flex items-center gap-4 font-semibold tracking-wider">
                      Order Ticket Total:{' '}
                      <span className="text-gold font-bold text-lg">
                        {formatToIDR(ticketTotalPrice)}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white">
                    <p className="inline-flex gap-3">
                      <BsTicketFill className="fill-gold text-xl" />
                      Eventology Voucher
                    </p>

                    {/* Ganti teks tombol berdasarkan diskon yang dipilih */}
                    <button
                      type="button"
                      className="p-3 font-bold tracking-wide cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    >
                      {selectedDiscount !== 0
                        ? `Discount ${selectedDiscount}%`
                        : 'Choose Voucher'}
                    </button>

                    {/* Put this part before </body> tag */}
                    {isOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                          <h3 className="text-lg font-bold">Voucher</h3>
                          {profile.Discounts?.length > 0 ? (
                            profile.Discounts.map(
                              (item: any, index: number) => (
                                <label
                                  key={index}
                                  className="flex flex-row-reverse justify-between py-3"
                                >
                                  <input
                                    type="checkbox"
                                    name="usedDiscount"
                                    className='checkbox checkbox-xs'
                                    value={item.discount}
                                    checked={selectedDiscount === item.discount}
                                    onChange={() => {
                                      // Menggunakan setFieldValue untuk mengubah nilai form field "usedDiscount"
                                      setFieldValue(
                                        'usedDiscount', // Nama field yang ingin diubah
                                        selectedDiscount === item.discount
                                          ? 0
                                          : item.discount, // Jika sudah dipilih, reset ke 0; jika belum dipilih, set ke item.discount
                                      );
                                      // Juga memperbarui selectedDiscount di state lokal
                                      setSelectedDiscount(
                                        selectedDiscount === item.discount
                                          ? 0
                                          : item.discount,
                                      );
                                    }}
                                  />
                                  <p className=''>
                                    {item.discount > 0
                                      ? `Discount ${item.discount}%`
                                      : 'Tidak memiliki discount'}
                                  </p>
                                </label>
                              ),
                            )
                          ) : (
                            <p>Tidak memiliki diskon</p>
                          )}

                          {/* Close button */}
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              className="p-3 font-bold w-28 tracking-wider cursor-pointer uppercase text-white bg-gold"
                              onClick={() => setIsOpen(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <label>
                    <div className="flex p-3 w-full justify-between bg-white">
                      <div className="flex gap-3 items-center">
                        <p className="inline-flex gap-3">
                          <FaCoins className="fill-gold text-xl" />
                          Eventology Points
                        </p>
                        <p className="text-grey text-xs font-bold tracking-wide">
                          Redeem {totalPoints} Eventology Points
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold ${values.usedPoint > 0 ? 'text-gold' : 'text-grey'}`}
                        >
                          {' '}
                          [-{formatToIDR(totalPoints)}]
                        </span>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={values.usedPoint > 0}
                          onChange={(e) =>
                            setFieldValue(
                              'usedPoint',
                              e.target.checked ? totalPoints : 0,
                            )
                          }
                        />
                      </div>
                    </div>
                  </label>
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center w-full p-3 bg-white">
                      <p className="font-bold tracking-widest text-gold">
                        Total Payment
                      </p>
                      <h6 className="font-bold text-xl text-gold tracking-wider">
                        {formatToIDR(grandTotal)}
                      </h6>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-gold p-3 uppercase tracking-widest font-bold text-white"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
