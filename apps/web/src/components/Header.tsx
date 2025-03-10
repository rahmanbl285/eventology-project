'use client';

import Search from '@/app/(home)/_components/search';
import { token } from '@/lib/utils';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import profile from '../assets/profile.png';
import { IoIosLogOut } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { MdDashboard, MdEvent } from 'react-icons/md';
import { UserContext } from '@/app/userContext';
import { SwitchIsOrganizer } from '@/lib/user';
import toast from 'react-hot-toast';

export const Header = () => {
  const pathname = usePathname();
  const userContext = useContext(UserContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBurger, setIsBurger] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const hideHeadersOnPaths = [
    '/create-event',
    '/login',
    '/register',
    '/verify/activate',
    '/dashboard',
    '/settings',
    '/checkout',
  ];
  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLogin(false);
    window.location.reload();
  };


  const handleSwitchOrganizer = async () => {
    try {
      setLoading(true);
      const result = await SwitchIsOrganizer();

      if (result?.status === 'OK') {
        setUserInfo((prev) =>
          prev ? { ...prev, isOrganizer: result.isOrganizer } : prev,
        );
        toast.success('Berhasil beralih peran!');
      } else {
        toast.error('Gagal mengganti peran. Coba lagi.');
      }
    } catch (error) {
      console.error('Error switching organizer:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const toggleNavBar = () => {
    setIsBurger(!isBurger);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsLogin(!!token);
  }, []);

  if (hideHeadersOnPaths.some((path) => pathname.startsWith(path))) return null;

  if (!userContext) {
    return null;
  }

  const { userInfo, setUserInfo } = userContext;

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className={`fixed z-50 py-4 px-5 text-white bg-transparent w-full h-fit transition duration-300 ${isScrolled ? 'backdrop-blur' : ''}`}
      >
        <div className="flex items-center justify-between">
          <Link href={'/'} className="text-white tracking-[0.25em] p-2">
            eventology
          </Link>
          <div className="hidden md:block">
            <Search />
          </div>
          <div className="hidden md:flex gap-5">
            <Link
              href={'/explore'}
              className="text-white py-1 px-2 tracking-wider"
            >
              explore
            </Link>
            {userInfo?.isOrganizer ? (
              <Link
                href={'/create-event'}
                className="text-white py-1 px-2 tracking-wider"
              >
                create event
              </Link>
            ) : (
              <Link
                href={'/dashboard/tickets'}
                className="text-white py-1 px-2 tracking-wider"
              >
                my tiket
              </Link>
            )}
          </div>
          <div className="hidden md:flex gap-5">
            {isLogin ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-sm">
                    <Image src={profile.src} alt="" width={10} height={10} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm text-white tracking-wider dropdown-content bg-black rounded-sm z-1 mt-3 w-52 py-2 px-1 shadow"
                >
                  <li>
                    <button
                      onClick={handleSwitchOrganizer}
                      disabled={loading}
                      className="text-center hover:bg-gold rounded-none"
                    >
                      {loading
                        ? 'Mengubah Peran...'
                        : userInfo?.isOrganizer
                          ? 'Beralih ke Pembeli'
                          : 'Beralih ke Event Organizer'}
                    </button>
                  </li>
                  <li>
                    <Link
                      href={'/dashboard'}
                      className="inline-flex items-center gap-3 text-white"
                    >
                      <MdDashboard />
                      dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={'/dashboard/events'}
                      className="inline-flex items-center gap-3 text-white"
                    >
                      <MdEvent />
                      my event
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={'/dashboard/profile'}
                      className="inline-flex items-center gap-3 text-white"
                    >
                      <FaUser />
                      profile
                    </Link>
                  </li>
                  <hr className="text-white/10 my-2" />
                  <li>
                    <button className="text-gold" onClick={handleLogout}>
                      <IoIosLogOut />
                      logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  href={'/register'}
                  className="text-white py-1 px-2 tracking-wider"
                >
                  register
                </Link>
                <Link
                  href={'/login'}
                  className="text-white py-1 px-2 tracking-wider"
                >
                  sign in
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleNavBar}
              className="inline-flex items-center relative justify-center p-2 text-white"
            >
              {isBurger ? (
                <svg
                  className="h-5 w-5 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {isBurger && (
          <div className="md:hidden">
            <div className="flex flex-col gap-3 px-3 py-5 text-sm space-y-2 bg-black">
              <Search />
              {isLogin ? (
                <div className="flex flex-col gap-3 tracking-widest">
                  <div className="flex w-full gap-5 justify-evenly text-center">
                    {userInfo?.isOrganizer ? (
                      <Link
                        href={'/create-event'}
                        className="bg-gold text-white rounded-sm py-2 w-1/2"
                      >
                        create event
                      </Link>
                    ) : (
                      <Link
                        href={'/dashboard/tickets'}
                        className="bg-gold text-white rounded-sm py-2 w-1/2"
                      >
                        my tiket
                      </Link>
                    )}

                    <Link
                      href={'/explore'}
                      className="bg-gold text-white rounded-sm py-2 w-1/2"
                    >
                      explore
                    </Link>
                  </div>

                  <Link
                    href={'/dashboard'}
                    className="inline-flex items-center gap-3 text-white"
                  >
                    <MdDashboard />
                    dashboard
                  </Link>
                  <Link
                    href={'/dashboard/events'}
                    className="inline-flex items-center gap-3 text-white"
                  >
                    <MdEvent />
                    my event
                  </Link>
                  <Link
                    href={'/dashboard/profile'}
                    className="inline-flex items-center gap-3 text-white"
                  >
                    <FaUser />
                    profile
                  </Link>
                  <hr className="text-white/10 my-2" />
                  <button
                    className="text-gold inline-flex items-center gap-3 font-bold"
                    onClick={handleLogout}
                  >
                    <IoIosLogOut className="text-lg" /> logout
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex w-full gap-5 justify-evenly text-center">
                    <Link
                      href={'/register'}
                      className="bg-gold text-white  py-2 w-1/2"
                    >
                      register
                    </Link>
                    <Link
                      href={'/login'}
                      className="bg-gold text-white  py-2 w-1/2"
                    >
                      sign in
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3 tracking-widest">
                    <Link href={'/create-event'} className="block text-white">
                      create event
                    </Link>
                    <Link href={'/explore'} className="block text-white">
                      explore
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
