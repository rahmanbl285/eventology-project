'use client';

import Link from 'next/link';
import { FaUserEdit } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { MdArrowForwardIos } from 'react-icons/md';

export default function DrawerEditProfile() {
  return (
    <>
      <div className="lg:flex lg:w-1/3 lg:flex-col lg:p-5 lg:shadow-right-only hidden">
        <ul className="menu  p-0 pt-2 justify-start h-full gap-7 bg-black text-white">
          <h1 className='text-xl font-bold'>Settings</h1>
          <li>
            <Link
              href={'/dashboard/profile/edit'}
              className="flex hover:text-gold justify-between p-1"
            >
              <p className='font-semibold'>Profile</p>
              <MdArrowForwardIos />
            </Link>
          </li>
          <li>
            <Link
              href={'/dashboard/profile/edit/account'}
              className="flex justify-between p-1 hover:text-gold"
            >
              <p className='font-semibold '>Account</p>
              <MdArrowForwardIos />
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col min-h-screen lg:hidden">
        <div className="shadow-lg fixed bottom-0 left-0 w-full">
          <ul className="menu p-4 gap-10 bg-black text-white flex flex-row justify-around w-full">
            <li>
              <Link href={'/dashboard/profile/edit'}>
                <FaUserEdit className="text-2xl text-white" />
              </Link>
            </li>
            <li>
              <Link href={'/dashboard/profile/edit/account'}>
                <IoMdSettings className="text-2xl text-white" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
