'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import editProfile from '../../../../assets/editProfile.png';
import CopyButton from '@/components/share/copy';
import { GetUserProfile } from '@/lib/user';
import MyDiscount from '../_components/profile/my-discount';
import Link from 'next/link';

export default function ProfileContent() {
  const [profile, setProfile] = useState<any>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await GetUserProfile();
        
        setProfile(data);
        console.log('data', data);
        const totalPoint = data.Points.reduce(
          (acc: number, point: any) => acc + point.amount,
          0,
        );
        setTotalPoints(totalPoint);
      } catch (err) {
        console.error('Error Fetching Profile: ', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex bg-black flex-col w-full h-dvh">
      <div className="flex flex-col w-full justify-center items-center md:flex-row md:h-full mb-20">
        <div className="flex w-full flex-col md:w-1/2 p-5 gap-3 justify-center items-center">
          <Image
            className="object-cover rounded-full h-44 w-44 md:h-52 md:w-52"
            src={profile?.image || editProfile}
            alt={''}
            width={350}
            height={350}
          />
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-xl text-gold font-bold">{profile.name}</h2>
            <h3 className="text-md text-grey">{profile.email}</h3>
          </div>
          <div className="flex gap-5">
            <div className="inline-flex gap-3 items-center border border-dotted border-white py-2 pl-4 pr-4 rounded-none">
              <h6 className="uppercase text-white wider text-md font-bold">
                {profile?.Referral?.myReferralCode}
              </h6>
              <CopyButton referral={profile?.Referral?.myReferralCode} />
            </div>
            <Link
              href={'/dashboard/profile/edit'}
              className="py-1 px-3 text-white bg-gold flex items-center tracking-wide"
            >
              Edit Profile
            </Link>
          </div>
        </div>
        <div className="flex flex-col card p-10 md:mr-5 gap-3 md:w-1/2 w-full ">
          <div>
            <h6 className="text-xl  text-gold tracking-wider font-playball">
              General <span className="text-white">Information</span>
            </h6>
            <div className="flex flex-col gap-2 pt-2">
              <div className="inline-flex justify-between">
                <h3 className="text-white">name</h3>
                <h3 className="text-white">{profile.name}</h3>
              </div>
              <div className="inline-flex justify-between">
                <h3 className="text-white">username</h3>
                <h3 className="text-white">{profile.username}</h3>
              </div>
              <div className="inline-flex justify-between">
                <h3 className="text-white">my point</h3>
                <h3 className="text-white">{totalPoints}</h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <h6 className="text-xl font-playball tracking-wider text-gold">
              My Discount <span className="text-white">Voucher</span>
            </h6>
            <MyDiscount
              data={
                profile?.Discounts
              }
              emptyTitle={'There is no discount available for you.'}
              emptyStateSubtext={
                "Don't worry - many promotions waiting for you."
              }
              collectionType="MyDiscount"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
