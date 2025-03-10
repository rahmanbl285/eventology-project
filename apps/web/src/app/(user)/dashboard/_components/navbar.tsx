'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@/app/userContext';
import { deleteToken } from '@/app/action';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import profile from '../../../../assets/profile.png'

export default function NavBar({ profileImg }: { profileImg: string }) {
    const { setUserInfo } = useContext<any>(UserContext)
    const router = useRouter()

    const onLogout = () => {
        deleteToken('token');
        localStorage.removeItem('token')
        setUserInfo(null)
        Cookies.remove('token')
        router.push('/')
    }

  return (
    <div className='flex flex-col bg-black px-5 py-3'>
      <div className="navbar justify-between">
        <h6 className='text-xl font-roboto font-bold text-gold  tracking-widest'>Dash<span className='text-white'>board</span></h6>
        <div className="flex gap-5">
          <Link href={'/create-event'} className="md:flex md:rounded-sm md:p-3 md:text-white md:bg-gold md:font-bold md:tracking-wider hidden">
            Create Event
          </Link>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-12 rounded-full">
                <Image src={profileImg || profile.src} alt={'profile'} width={200} height={200} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-black rounded-sm w-52"
            >
              <li className='md:hidden'>
                <Link href={'/create-event'} className="justify-between text-white">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href={'/dashboard/profile'} className="justify-between text-white">
                  Profile
                </Link>
              </li>
              <li>
                <Link href={'/dashboard'} className="justify-between text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={'/dashboard/events'} className="justify-between text-white">
                  Events
                </Link>
              </li>
              <li>
                <button onClick={onLogout} className="justify-between text-white">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
