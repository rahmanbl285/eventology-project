'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DeleteEvent, GetEventSlug } from '@/lib/event';
import Image from 'next/image';
import { IEvent } from '@/types';
import { formatDateCard } from '@/helpers/formatDate';
import { GetEventOrderSummary } from '@/lib/transaction';
import defaultImage from '../../../../../assets/hero-sample.jpg';
import { formatToIDR } from '@/helpers/formatPrice';
import ConfirmButton from '../../_components/eventsSlug/confirm-button';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';

const defaultImg = defaultImage.src;

export default function EventDetailOrganizer() {
  const { slug } = useParams();
  const [event, setEvent] = useState<IEvent | undefined>();
  const [orderSum, setOrderSum] = useState<any>({});
  const formattedStartDate = formatDateCard(event?.startDate || '', true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      try {
        const eventData = await GetEventSlug(undefined, slug as string);
        if (!eventData?.event) return;

        setEvent(eventData.event);

        const orderData = await GetEventOrderSummary();
        const filteredTransactions = orderData.transaction.filter(
          (t: any) => t.eventId === eventData.event.id,
        );

        setOrderSum({ ...orderData, transaction: filteredTransactions });
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [slug]);

  const removeTransaction = (transactionId: string) => {
    setOrderSum((prevOrderSum: any) => ({
      ...prevOrderSum,
      transaction: prevOrderSum.transaction.filter(
        (item: any) => item.id !== transactionId,
      ),
    }));
  };

  const handleDeleteEvent = async () => {
    if (!event?.id) {
      alert('Event ID is undefined!');
      return;
    }
    setIsDeleting(true);
    const response = await DeleteEvent(event.id);
    if (response?.status === 'OK') {
      toast.success('Event deleted successfully!');
      setIsModalOpen(false);
    } else {
      toast.error('Failed to delete event!');
    }
    setIsDeleting(false);
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="flex flex-col p-5 w-full gap-5">
      <div className="relative flex flex-col">
        <Image
          src={event?.image || defaultImg}
          width={1000}
          height={500}
          alt={event?.title || 'event photo'}
          className="object-cover lg:rounded-sm w-full h-80 brightness-50"
          priority
        />
        <div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link
              className="cursor-pointer"
              href={`/events/${event.slug}?id=${event.id}`}
            >
              <h1 className="text-white text-center text-2xl font-roboto font-bold">
                {event.title}
              </h1>
              <p className="text-white text-center">
                {formattedStartDate.day} {formattedStartDate.month}{' '}
                {formattedStartDate.year}
              </p>
            </Link>
          </div>
          <div className="absolute flex items-center justify-center gap-3 bottom-2 right-2">
            <Link
              href={`/dashboard/events/${event.slug}/update`}
              className="inline-flex gap-2 px-3 py-2 rounded-sm bg-white text-black"
            >
              <FaEdit className="text-lg" />
              Update Event
            </Link>

            <button
              className="inline-flex gap-2 px-3 py-2 rounded-sm bg-gold text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <MdDelete className="text-lg" />
              Delete Event
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h3 className="text-lg font-bold">Hapus Event?</h3>
              <p className="py-4">
                Apakah Anda yakin ingin menghapus event ini?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-white text-black rounded-sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 bg-gold text-white rounded-sm"
                  onClick={handleDeleteEvent}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead className="text-white">
            <tr>
              <th>Transaction Id</th>
              <th>Buyer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th colSpan={2}>Confirmation</th>
            </tr>
          </thead>
          <tbody>
            {orderSum.transaction && orderSum.transaction.length > 0 ? (
              orderSum.transaction.map((item: any, index: number) => {
                const formattedCreatedDate = formatDateCard(
                  item.createdAt || '',
                  true,
                );

                return (
                  <tr key={index} className="text-white">
                    <td className="w-4">{item.id}</td>
                    <td>{item.users?.name}</td>
                    <td>{formatToIDR(item.total)}</td>
                    <td>
                      {item.status === 'waitingConfirmation' ? (
                        <p>Waiting Confirmation</p>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      {formattedCreatedDate.day} {formattedCreatedDate.month}{' '}
                      {formattedCreatedDate.year}
                    </td>
                    <td className="w-4">
                      <ConfirmButton
                        transactionId={item.id}
                        isConfirmed={true}
                        onConfirmSuccess={removeTransaction}
                      />
                    </td>
                    <td className="w-4">
                      <ConfirmButton
                        transactionId={item.id}
                        isConfirmed={false}
                        onConfirmSuccess={removeTransaction}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-white">
                  There are no transactions awaiting confirmation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
