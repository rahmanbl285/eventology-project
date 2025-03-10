import { formatToIDR } from '@/helpers/formatPrice';
import { RootState } from '@/lib/features/store';
import Link from 'next/link';
import { IoTicket } from 'react-icons/io5';
import { useSelector } from 'react-redux';

export default function CheckoutTicket() {
  const { eventId, ticket, ticketTotalPrice, slugEvent } = useSelector(
    (state: RootState) => state.ticket,
  );

  // Membuat query params
  const queryParams = new URLSearchParams({
    slugEvent,
    eventsId: String(eventId),
    ticket: JSON.stringify(ticket), // Menggunakan JSON string untuk objek
    ticketTotalPrice: String(ticketTotalPrice),
  }).toString();

  const ticketCount = ticket ? ticket.reduce((acc, curr) => acc + curr.ticketCount, 0) : 0;
  const ticketTypes = ticket ? ticket.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.ticketType] = curr.ticketCount;
    return acc;
  }, {}) : {};

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:card lg:rounded-md w-full bg-white">
        <div className="card-body p-8 gap-5 justify-center lg:max-w-[375px] lg:max-h-[375px]">
          <div className="flex flex-nowrap items-center gap-3">
            <div>
              <IoTicket className="text-4xl fill-black" />
            </div>
            <div>
              {ticketCount === 0 ? (
                <p className="text-justify">
                  Anda belum memilih tiket. Silakan pilih lebih dulu di tab menu
                  TIKET.
                </p>
              ) : (
                <p className="text-justify">
                  Anda sudah memilih tiket. Anda telah memilih {ticketCount}{' '}
                  tiket.
                </p>
              )}
            </div>
          </div>
          <div className="card-actions flex flex-nowrap gap-4">
            <hr />
            <div className="flex flex-col w-full gap-3">
              <div className="space-y-2">
                {Object.entries(ticketTypes || {}).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{type}</span>
                    <span>{count} tiket</span>
                  </div>
                ))}
              </div>
              {/* Display total price */}
              <div className="flex justify-between text-sm font-bold text-black">
                <p className="font-bold tracking-wider text-md text-black">
                  {ticketCount > 0
                    ? `Total harga: ${formatToIDR(ticketTotalPrice)}`
                    : `Harga mulai dari ${formatToIDR(ticketTotalPrice)}`}
                </p>
              </div>
              <div className="w-full mt-3 p-1.5 uppercase tracking-wider text-sm text-center text-white font-bold font-roboto bg-gold hover:bg-black hover:text-gold">
                <Link href={`/checkout?${queryParams}`}>Beli tiket</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden fixed z-[999] p-4 bottom-0 w-full h-fit bg-black">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col pl-3 w-1/2">
            <p className="font-bold tracking-wider text-md text-white">
              {ticketCount > 0
                ? `Total harga: ${formatToIDR(ticketTotalPrice)}`
                : `Harga mulai dari ${formatToIDR(ticketTotalPrice)}`}
            </p>
          </div>
          <div className="w-44 p-1.5 uppercase tracking-wider text-sm text-center text-white font-bold font-roboto bg-gold hover:bg-black hover:text-gold">
            <Link href={`/checkout?${queryParams}`}>Beli tiket</Link>
          </div>
        </div>
      </div>
    </>
  );
}
