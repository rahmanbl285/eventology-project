'use client';

import Link from 'next/link';
import { IoHomeSharp, IoTicket } from 'react-icons/io5';
import { MdEventAvailable } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import NavBar from './_components/navbar';
import { GetUserProfile } from '@/lib/user';
import { UserContext } from '@/app/userContext';

export default function LayoutDashboard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const userContext = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await GetUserProfile();
        setProfile(data);

      } catch (err) {
        console.error('Error Fetching Profile: ', err);
      }
    };
    fetchProfile();
  }, []);
  
  if (!userContext) {
    return null;
  }
  const { userInfo } = userContext;

  return (
    <>
      <div className="lg:drawer bg-black lg:drawer-open hidden">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="lg:drawer-content lg:flex lg:flex-col">
          <NavBar profileImg={profile?.image} />
          {children}
        </div>
        <div
          className={`drawer-side shadow-lg fixed transition-all duration-1000 ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
          <ul className="menu p-4 min-h-full gap-10 justify-center bg-black text-white ">
            {userInfo?.isOrganizer && (
              <li>
                <Link
                  href={'/dashboard'}
                  className="flex items-end hover:text-gold gap-2"
                >
                  <IoHomeSharp className="text-lg text-white" />{' '}
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>
              </li>
            )}

            <li>
              <Link
                href={
                  userInfo?.isOrganizer
                    ? '/dashboard/events'
                    : '/dashboard/tickets'
                }
                className="flex hover:text-gold items-end gap-2"
              >
                {userInfo?.isOrganizer ? (
                  <MdEventAvailable className="text-lg text-white" />
                ) : (
                  <IoTicket className="text-lg text-white" />
                )}{' '}
                {!isCollapsed && (
                  <span>
                    {userInfo?.isOrganizer ? 'My Events' : 'My Tickets'}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href={'/dashboard/profile'}
                className="flex hover:text-gold items-end gap-2"
              >
                <FaUserCircle className="text-lg text-white" />{' '}
                {!isCollapsed && <span>My Profile</span>}
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center hover:text-gold"
              >
                {isCollapsed ? (
                  <FiChevronRight className="text-lg text-white" />
                ) : (
                  <FiChevronLeft className="text-lg text-white" />
                )}
                {!isCollapsed && (
                  <span className="ml-2 hover:text-gold">Collapse</span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col min-h-screen lg:hidden">
        <div className="flex-grow bg-black flex flex-col">
          <NavBar profileImg={profile?.image} />
          {children}
        </div>
        <div className="shadow-lg fixed bottom-0 left-0 w-full">
          <ul className="menu p-4 gap-10 bg-black text-white flex flex-row justify-around w-full">
            {userInfo?.isOrganizer && (
              <li>
                <Link href={'/dashboard'} className="hover:text-gold">
                  <IoHomeSharp className="text-2xl text-white" />
                </Link>
              </li>
            )}
            <li>
              <Link
                href={
                  userInfo?.isOrganizer
                    ? '/dashboard/events'
                    : '/dashboard/tickets'
                }
                className="hover:text-gold"
              >
                {userInfo?.isOrganizer ? (
                  <MdEventAvailable className="text-2xl text-white" />
                ) : (
                  <IoTicket className="text-2xl text-white" />
                )}{' '}
              </Link>
            </li>

            <li>
              <Link href={'/dashboard/profile'} className="hover:text-gold">
                <FaUserCircle className="text-2xl text-white" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
