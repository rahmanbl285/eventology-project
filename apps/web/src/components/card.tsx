'use client';

import { capitalizeWords } from '@/helpers/formatCapitalize';
import { formatDateCard } from '@/helpers/formatDate';
import { formatToIDR } from '@/helpers/formatPrice';
import splitTitle from '@/helpers/formatTitle';
import { ICardEvent } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function Card({ id, image, title, startDate, price, city, slug }: ICardEvent) {
  const formatPrice = formatToIDR(price)
  const { month, day } = formatDateCard(startDate)
  const formatCity = capitalizeWords(city)
  const formatTitle = splitTitle(capitalizeWords(title), 25)
  return (
    <>
    <Link href={`events/${slug}?id=${id}`} className='w-full'>
      <div className="flex justify-evenly h-[320px] p-5">
          <div className=" bg-white min-w-52 shadow-xl flex-grow">
            <figure>
              <Image
                src={image}
                alt={title}
                width={1000}
                height={1000}
                className="object-cover h-44 brightness-75"
                priority
              />
            </figure>
            <div className="flex flex-1 p-3 gap-7">
              <div className='flex flex-col justify-center items-center'>
                  <p className='text-center'>{month.toUpperCase()}</p>
                  <h6 className='text-center text-xl font-extrabold'>{day}</h6>
              </div>
              <div className='flex flex-col gap-1'>

              <h2 className="text-md font-bold text-black">{formatTitle}</h2>
              <p className='text-grey'>{formatCity}</p>
              <p className='text-black'>{price !== 0 ? formatPrice : "Free"}</p>
              </div>
            </div>
          </div>
      </div>
      </Link>
    </>
  );
}
