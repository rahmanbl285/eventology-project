'use client';

import { FaKey, FaPowerOff } from 'react-icons/fa6';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import Link from 'next/link';

export default function EditAccount() {
  return (
    <div className="flex flex-col lg:pr-7">
      <div className="hidden lg:flex lg:flex-col lg:pb-5">
        <p className="text-white lg:text-xs ">
          See your account information like your email address and password.
        </p>
      </div>
      <div className="flex flex-col p-7 lg:p-0 gap-5 h-[75vh] lg:h-auto">
        <Link
          href="/dashboard/profile/edit/account/email"
          className="flex justify-between items-center shadow-md p-5"
        >
          <div className="inline-flex gap-5 items-center">
            <MdEmail className="text-xl text-white" />
            <h6 className='text-white'>Change your email</h6>
          </div>
          <IoMdArrowRoundForward className='text-white'/>
        </Link>

        <Link
          href="/dashboard/profile/edit/account/password"
          className="flex justify-between items-center shadow-md p-5"
        >
          <div className="inline-flex gap-5 items-center">
            <FaKey className="text-xl text-white" />
            <h6 className='text-white'>Change your password</h6>
          </div>
          <IoMdArrowRoundForward className='text-white'/>
        </Link>
        <Link
          href="/dashboard/profile/edit/account/deactivate"
          className="flex justify-between items-center shadow-md p-5"
        >
          <div className="inline-flex gap-5 items-center">
            <FaPowerOff className="text-xl text-white" />
            <h6 className='text-white'>Deactivate Account</h6>
          </div>
          <IoMdArrowRoundForward className='text-white'/>
        </Link>
      </div>
    </div>
  );
}
