'use client';

import { GetUserProfile } from '@/lib/user';
import { useEffect, useState } from 'react';
import ChangeEmailModal from './verify-password';

export default function CurrentEmail() {
  const [profile, setProfile] = useState<any>({});
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await GetUserProfile();
        setProfile(data);
        console.log(data);
      } catch (err) {
        console.log('Error Fetching Profile: ', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col gap-3 p-5 lg:pt-3 lg:pl-0 lg:pr-7">
      <div className="flex flex-col gap-2">
        <p className="text-white">Current Email Address</p>
        <input
          type="text"
          placeholder={profile.email}
          className="input input-bordered rounded-none w-full max-w-full disabled:placeholder-black/50"
          disabled
        />
      </div>
      <hr className="text-white" />
      
      <ChangeEmailModal />
    </div>
  );
}
