'use client';

import { getEventTitle } from '@/app/action';
import { ITitleArr } from '@/types';
import { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDebounceCallback } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Search() {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const [titleArr, setTitleArr] = useState<ITitleArr[]>([]);
  const [focus, setFocus] = useState(false);
  const router = useRouter();

  const debounced = useDebounceCallback((val) => {
    setValue(val);
  }, 500);

  useEffect(() => {
    if (value.length > 0) {
      const getData = async () => {
        try {
          const res = await getEventTitle(value);
          if (res.status === 'OK') setTitleArr(res.eventTitleList);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      getData();
    } else {
      setTitleArr([]);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.length > 0) {
      router.push(`/explore?t=${search}`);
    }
    setValue('');
    setSearch('');
  };
  

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-96 relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          placeholder="Find exciting events here!"
          onChange={(e) => {
            setSearch(e.target.value);
            debounced(e.target.value);
          }}
          onFocus={() => setFocus(true)}
          onBlur={() =>
            setTimeout(() => {
              setFocus(false);
            }, 100)
          }
          className={`w-full p-2 pl-3 placeholder:tracking-wider transition-colors duration-300 ${
            focus
              ? 'bg-white text-black placeholder:text-black/60'
              : 'bg-white/20 text-white placeholder:text-white/60'
          }`}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gold/80"
        >
          <AiOutlineSearch className="fill-white" />
        </button>
      </div>

      <div className={focus && value ? '' : 'hidden'}>
        {titleArr.length > 0 ? (
          <div className="z-[1] absolute bg-white w-full p-2 top-12 flex flex-col gap-1">
            {titleArr.map((item, index) => (
              <Link
                href={`/events/${item.slug}?id=${item.id}`}
                key={index}
                className="p-1 text-black/65 text-sm truncate hover:bg-grey/40 "
              >
                {item.title}
              </Link>
            ))}
            <span
              onClick={() => router.push(`/explore?t=${value}`)}
              className="p-1 font-semibold text-black/65 text-center text-sm truncate hover:bg-grey/40  cursor-pointer"
            >
              Load more event
            </span>
          </div>
        ) : (
          <div className="absolute bg-white text-black/65 w-full p-2  top-12 flex flex-col gap-1">
            <span className="p-1 text-sm text-center truncate hover:bg-grey/40 ">
              Event not found
            </span>
          </div>
        )}
      </div>
    </form>
  );
}
