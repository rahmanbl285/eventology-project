'use client';

import Image from 'next/image';
import festival from '../../../assets/category/festival.jpg';
import konser from '../../../assets/category/konser.jpg';
import pertandingan from '../../../assets/category/pertandingan.jpg';
import pameran from '../../../assets/category/pameran.jpg';
import konferensi from '../../../assets/category/konferensi.jpg';
import workshop from '../../../assets/category/workshop.jpg';
import pertunjukkan from '../../../assets/category/pertunjukkan.jpg';
import seminar from '../../../assets/category/seminar.jpg';
import { useState } from 'react';
import Link from 'next/link';
import TitleCard from './title';

export default function Category() {
  const categories = [
    {
      image: festival.src,
      alt: '',
      category: 'festival',
    },
    {
      image: konser.src,
      alt: '',
      category: 'konser',
    },
    {
      image: pertandingan.src,
      alt: '',
      category: 'pertandingan',
    },
    {
      image: pameran.src,
      alt: '',
      category: 'pameran',
    },
    {
      image: konferensi.src,
      alt: '',
      category: 'konferensi',
    },
    {
      image: workshop.src,
      alt: '',
      category: 'workshop',
    },
    {
      image: pertunjukkan.src,
      alt: '',
      category: 'pertunjukan',
    },
    {
      image: seminar.src,
      alt: '',
      category: 'seminar',
    },
  ];

  const [isHover, setIsHover] = useState<number | null>(null);

  return (
    <>
    <TitleCard title={'Eventology by'} subtitle={'Categories'}/>
    <div className="flex justify-evenly p-5 overflow-x-scroll w-full h-full gap-4">
      {categories.map((category, idx) => (
        <div
          key={idx}
          className="relative w-32 h-32 flex-shrink-0"
          onMouseEnter={() => setIsHover(idx)}
          onMouseLeave={() => setIsHover(null)}
        >
          <Image
            src={category.image}
            alt={category.alt}
            width={1000}
            height={1000}
            className={`w-32 h-32 object-cover ${
              isHover === idx
                ? 'grayscale-0 brightness-75'
                : 'grayscale brightness-75'
            } transition-all duration-300`}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
            <Link
              href={''}
              className=" text-white font-bold tracking-widest uppercase"
            >
              {category.category}
            </Link>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
