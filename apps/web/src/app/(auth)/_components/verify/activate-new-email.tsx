'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import verify from '../../../../assets/verify.jpg';
import { MdVerified } from 'react-icons/md';
import { VerifyEmail } from '@/lib/user';
import toast from 'react-hot-toast';

export default function ActivateEmailPage() {
  const params = useParams();
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const token = params.token.toString()
      const res = await VerifyEmail(token)
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Email Activation failed')
      }
      toast.success('Email successfully updated!')
      setTimeout(() => {
        router.push('/dashboard/profile')
      }, 2000)
    } catch (err: any) {
      console.log(err);
      toast.error(err.message)
    }
  };

  return (
    <div className="flex bg-white justify-center items-center min-h-screen w-full">
      <div className="card w-96 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center">
          <h6 className="text-xl font-bold text-center">
            <MdVerified className="inline text-gold text-xl text-center mr-2" />
            <span className="font-bold text-gold">Verify </span>
            Your Account with{' '}
            <span className="font-bold text-gold">One Click</span>
          </h6>
          <Image src={verify} alt={''} height={500} width={500} />
          <p className="text-center text-xs text-grey">
            We received a request to change the email address associated with
            your account. To complete the verification process and ensure
            uninterrupted access to all features, please click the button below:{' '}
          </p>
        </div>
        <div>
          <button
            onClick={handleVerify}
            className="btn bg-black hover:bg-gold text-white"
          >
            Click Me!
          </button>
        </div>
      </div>
    </div>
  );
}
