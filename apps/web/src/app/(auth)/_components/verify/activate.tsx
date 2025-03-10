'use client'

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import verify from '../../../../assets/verify.jpg'
import { MdVerified } from "react-icons/md";
import { ActivateAccount } from "@/lib/user";
import toast from "react-hot-toast";

export default function ActivatePage() {
    const params = useParams()
    const router = useRouter()

    const handleVerify = async () => {
        try {
            const token = params.token.toString()
            const res = await ActivateAccount(token)
            if (res.status !== 'OK') {
                throw new Error(res.message || 'Activation Account failed')
              }
              toast.success('Account successfully activated!')
              setTimeout(() => {
                router.push('/login')
              }, 2000)
        } catch (err: any) {
            console.log(err);
            toast.error(err.message)
        }
    }

    return (
        <div className="flex bg-white justify-center items-center min-h-screen w-full">
            <div className="card w-96 flex flex-col items-center gap-5">
                <div className="flex flex-col items-center">
                    <h6 className="text-xl font-bold text-center">
                        <MdVerified className="inline text-gold text-xl text-center mr-2"/>
                        <span className="font-bold text-gold">Verify </span>
                        Your Account with <span className="font-bold text-gold">One Click</span>
                    </h6>
                    <Image src={verify} alt={""} height={500} width={500} />
                    <p className="text-center text-xs text-grey">
                        Please click on this button to complete the verification process for your account and ensure your access to all features.
                    </p>
                </div>
                <div>
                    <button onClick={handleVerify} className="btn bg-black hover:bg-gold text-white">
                        Click Me!
                    </button>
                </div>
            </div>
        </div>
    )
}
