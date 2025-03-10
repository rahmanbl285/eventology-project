'use client';

import { GetUserProfile } from '@/lib/user';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import editProfile from '../../../../../../../../assets/editProfile.png';
import DeactivateModal from './deactivate-modal';

export default function DeactivatePage() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await GetUserProfile();
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col p-5 md:p-0 md:pr-5">
      <div className="flex flex-1 gap-5 items-center py-2">
        <Image
          src={profile?.image || editProfile}
          alt={''}
          width={40}
          height={40}
          className="object-cover rounded-full h-10 w-h-10 md:h-10 md:w-h-10"
        />
        <div className="flex flex-col text-xs tracking-wide">
          <p className="font-bold text-white">{profile.name}</p>
          <p className='text-white'>@{profile.username}</p>
        </div>
      </div>
      <div className='flex flex-col gap-2 text-justify'>
        <h1 className="text-lg font-bold tracking-wide text-white">
          This will deactivate your account
        </h1>
        <p className="text-xs text-grey">
          You are about to begin the deactivation process for your account. Your
          display name, @username, and public profile will no longer be visible
          on the platforms website or mobile applications.
        </p>

        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-bold tracking-wide text-white">
            What else you should know
          </h1>

          <div className="flex flex-col gap-2 text-xs">
            <p className='text-grey'>
              You can restore your account if it was accidentally or wrongfully
              deactivated for up to 30 days after deactivation.
            </p>
            <hr className='text-white'/>
            <p className='text-grey'>
              If you just want to change your @username, you don`t need to
              deactivate your account — edit it in your profile.
            </p>
            <hr className='text-white'/>
            <p className='text-grey'>
              To use your current @username or email address with a different
              account, please change them before deactivating this account.
            </p>
          </div>
        </div>
        <DeactivateModal/>
      </div>
    </div>
  );
}
