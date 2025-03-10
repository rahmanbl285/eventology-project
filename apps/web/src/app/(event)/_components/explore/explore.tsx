'use client';

import Card from '@/components/card';
import { getAllLocation, GetEvent } from '@/lib/event';
import { ICategory, IEvent } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { capitalizeWords } from '@/helpers/formatCapitalize';

export default function AllEvents() {
  const params = useSearchParams();
  const searchQuery = params.get('t');
  const [events, setEvents] = useState<IEvent[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Categories');
  const [selectedLocation, setSelectedLocation] =
    useState<string>('All Locations');
  const [filteredEvent, setFilteredEvent] = useState<IEvent[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>('Closest Event');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sortOptions = [
    'Closest Event',
    'Furthest Event',
    'Event Name (A to Z)',
    'Event Name (Z to A)',
  ];
  const perPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await GetEvent();
      
      setEvents(data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      const data = await getAllLocation();
      setLocation(data);
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const filterEvent = () => {
      let filtered = events;

      if (searchQuery) {
        filtered = filtered.filter((event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (selectedCategory !== 'All Categories') {
        filtered = filtered.filter(
          (event) => event.category === selectedCategory,
        );
      }

      if (selectedLocation !== 'All Locations') {
        filtered = filtered.filter((event) => event.city === selectedLocation);
      }

      setFilteredEvent(filtered);
    };
    filterEvent();
  }, [selectedCategory, selectedLocation, events, searchQuery]);

  const sortedEvents = useMemo(() => {
    let sorted = [...filteredEvent];
    if (selectedSort === 'Closest Event') {
      return sorted.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
    } else if (selectedSort === 'Furthest Event') {
      return sorted.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
    } else if (selectedSort === 'Event Name (A to Z)') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'Event Name (Z to A)') {
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    }
    return sorted;
  }, [selectedSort, filteredEvent]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return sortedEvents.slice(startIndex, endIndex);
  }, [currentPage, perPage, sortedEvents]);

  const filteredLocations = useMemo(() => {
    return location
      .filter((loc) =>
        loc.toLowerCase().includes(searchLocation.toLocaleLowerCase()),
      )
      .slice(0, 5);
  }, [location, searchLocation]);

  return (
    <div className="flex flex-col bg-black">
      <div className="flex flex-col mt-24 sm:mt-32 w-full gap-3">
        <div className="w-full text-center">
          <h6 className="text-white font-extrabold font-roboto uppercase tracking-widest text-4xl">
            Exp<span className="text-gold">lore</span>
          </h6>
        </div>
        <div className="flex flex-col items-center sm:flex-row w-full sm:mb-10 justify-center px-5 gap-2 sm:gap-5">
          <div className="dropdown">
            <label
              htmlFor="category"
              className="block focus:outline-none lowercase tracking-wider text-white text-sm font-roboto mb-1"
            >
              filter by{' '}
              <span className="font-playball text-gold text-lg">category</span>
            </label>
            <div
              tabIndex={0}
              role="button"
              className="select select-sm w-52 rounded-none bg-white items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {capitalizeWords(selectedCategory)}
            </div>
            <div
              className={`dropdown-content bg-white rounded-none z-[1] w-52 p-2 shadow ${
                dropdownOpen ? 'block' : 'hidden'
              }`}
            >
              <ul className="menu p-0">
                <li>
                  <button
                    className="hover:bg-transparent"
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setDropdownOpen(false);
                    }}
                  >
                    Semua
                  </button>
                </li>
                {Object.values(ICategory).map((cat) => (
                  <li key={cat} value={cat}>
                    <button
                      className="hover:bg-transparent"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setDropdownOpen(false); 
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dropdown">
            <label className="block focus:outline-none lowercase tracking-wider text-white text-sm font-roboto mb-1">
              filter by{' '}
              <span className="font-playball text-gold text-lg">locations</span>
            </label>
            <div
              tabIndex={0}
              role="button"
              className="select select-sm w-52 rounded-none bg-white items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {capitalizeWords(selectedLocation)}
            </div>
            <div
              className={`dropdown-content bg-white rounded-none z-[1] w-52 p-2 shadow ${
                dropdownOpen ? 'block' : 'hidden'
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                className="input input-sm rounded-none outline-none focus:outline-none bg-grey/30 border-none w-full mb-2"
                onChange={(e) => setSearchLocation(e.target.value)}
              />
              <ul className="menu p-0">
                <li>
                  <button
                    className="hover:bg-transparent"
                    onClick={() => {
                      setSelectedLocation('All Locations');
                      setDropdownOpen(false);
                    }}
                  >
                    Semua
                  </button>
                </li>
                {filteredLocations.map((loc, idx) => (
                  <li key={idx} value={loc}>
                    <button
                      className="hover:bg-transparent"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setDropdownOpen(false);
                      }}
                    >
                      {capitalizeWords(loc)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dropdown">
            <label
              htmlFor="sort"
              className="block focus:outline-none lowercase tracking-wider text-white text-sm font-roboto mb-1"
            >
              sort the{' '}
              <span className="font-playball text-gold text-lg">events</span>
            </label>
            <div
              tabIndex={0}
              role="button"
              className="select select-sm w-52 rounded-none bg-white items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedSort}
            </div>
            <div
              className={`dropdown-content bg-white rounded-none z-[1] w-52 p-2 shadow ${
                dropdownOpen ? 'block' : 'hidden'
              }`}
            >
              <ul className="menu p-0">
                {
                  sortOptions.map((sort) => (
                    <li key={sort} value={sort}>
                    <button
                      className="hover:bg-transparent"
                      onClick={() => {
                        setSelectedSort(sort);
                        setDropdownOpen(false); 
                      }}
                    >
                      {sort}
                    </button>
                  </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>

        <div className="grid px-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 flex-grow w-full h-full">
          {paginatedEvents.map((event) => (
            <Card
              id={event.id}
              key={event.id}
              image={event.image}
              title={event.title}
              startDate={event.startDate}
              price={
                event.Tickets.length > 0
                  ? event.Tickets.length > 1
                    ? Math.min(...event.Tickets.map((ticket) => ticket.price))
                    : event.Tickets[0].price
                  : 0
              }
              city={event.city}
              slug={event.slug}
            />
          ))}
        </div>

        <div className='flex w-full justify-center'>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1} 
            className="join-item btn border-none rounded-none bg-white text-black font-normal"
          >
            «
          </button>
          <button className="join-item btn border-none rounded-none bg-white text-black font-normal">
            Page {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * perPage >= sortedEvents.length}
            className="join-item btn border-none rounded-none bg-white text-black font-normal"
          >
           »
          </button>
        </div>
        </div>
      </div>
  );
}
