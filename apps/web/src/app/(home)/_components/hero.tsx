'use client';

import Link from 'next/link';
import Category from './category';
import AdsHero from './ads';
import CardLoc from './card-loc';
import SlidesHero from './slides';
import Top3AllTime from './top-three';

export default function HeroPage() {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      <SlidesHero />
      <div className="flex flex-col bg-black w-svw h-fit pr-5">
        <Category />
      </div>
      <div className=" bg-black w-svw h-full pr-5">
        <Top3AllTime />
      </div>
      <div className="pt-5">
        <AdsHero />
      </div>
      <div className="flex flex-col bg-black w-svw h-full pr-5">
        <CardLoc />
      </div>
      <div className="flex items-center justify-center px-5 py-10">
        <Link
          href={'/'}
          className="bg-transparent px-2 py-1 border rounded-sm tracking-wider border-white text-white uppercase"
        >
          Explore More Events
        </Link>
      </div>
    </div>
  );
}
