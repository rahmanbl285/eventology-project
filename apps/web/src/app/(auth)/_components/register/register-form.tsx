'use client';
import { RegUser } from '@/lib/user'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { IoKeyOutline } from 'react-icons/io5'
import { FaRegUser } from "react-icons/fa6";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineMail } from 'react-icons/ai'
import { CiBarcode } from "react-icons/ci";
import toast from 'react-hot-toast';
import registerBg from '../../../../../public/assets/bg-register.jpg'
import { RegisterSchema } from '@/lib/validationSchema';


export default function RegisterForm () {
    const onRegister = async (data: any): Promise<boolean> => {
        try {
          const res = await RegUser(data)
          if (res.status !== 'OK') {
            throw new Error(res.message || 'Registration failed')
          }
            toast.success('Registration successful! Please check your e-mail.')
            return true
        } catch (err: any) {
            toast.error(err.message)
            return false
        }
    }

    const [show, setShow] = useState(false);

    return (
        <Formik
            initialValues={{
                name: '',
                username: '',
                email: '',
                password: '',
                useReferral: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, action) => {
                console.log(values);
                const success = await onRegister(values);
                if (success) {
                    action.resetForm(); // Reset form hanya jika pendaftaran berhasil
                }
            }}
        >
            {() => {
                return (
                    <Form>
                        <div className="flex justify-center bg-cover bg-center items-center min-h-svh w-full" style={{ backgroundImage: `url(${registerBg.src})` }}>
                            <div className="card bg-white rounded-none w-96 ">
                                <div className="card-body">
                                    <div className="flex flex-col items-center pb-5">
                                        <h1 className="card-title text-black text-2xl">Register</h1>
                                        <p className="text-sm text-grey">Create your new account</p>
                                    </div>
                                    <div className="relative">
                                        <Field
                                            name="name"
                                            type="text"
                                            placeholder="Name"
                                            className="block bg-transparent placeholder:text-grey placeholder:text-xs text-black w-full border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                                        />
                                        <MdDriveFileRenameOutline className="absolute left-2 top-2.5 text-black"/>
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-xs text-gold font-semibold tracking-wider mt-1"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Field
                                            name="username"
                                            type="text"
                                            placeholder="Username"
                                            className="block bg-transparent placeholder:text-grey placeholder:text-xs text-black w-full border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                                        />
                                        <FaRegUser className="absolute left-2 top-2.5 text-black"/>
                                        <ErrorMessage
                                            name="username"
                                            component="div"
                                            className="text-xs text-gold font-semibold tracking-wider mt-1"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Field
                                            name="email"
                                            type="text"
                                            placeholder="Email"
                                            className="block bg-transparent placeholder:text-grey placeholder:text-xs text-black w-full border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                                        />
                                        <AiOutlineMail className="absolute left-2 top-2.5 text-black"/>
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-xs text-gold font-semibold tracking-wider mt-1"
                                        />
                                    </div>

                                    <div className='relative'>
                                        <Field
                                            name="useReferral"
                                            type="text"
                                            placeholder="Referral code (optional)"
                                            className="block bg-transparent placeholder:text-grey placeholder:text-xs text-black w-full border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                                        />
                                        <CiBarcode className="absolute left-2 top-2.5 text-black"/>
                                    </div>
                                    
                                    <div className="relative">
                                        <Field
                                            name="password"
                                            type={show ? 'text' : 'password'}
                                            placeholder="Password"
                                            className="block bg-transparent placeholder:text-grey placeholder:text-xs text-black w-full border border-grey p-1.5 pl-10 pr-10 shadow-sm sm:text-sm sm:leading-6"
                                        />
                                        <IoKeyOutline className="absolute left-2 top-2.5 text-black" />
                                        <button
                                            type="button"
                                            onClick={() => setShow(!show)}
                                            className="absolute right-3 top-2.5 text-black"
                                        >
                                            {show ? <HiEyeOff /> : <HiEye />}
                                        </button>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-xs text-gold font-semibold tracking-wider mt-1"
                                        />
                                    </div>

                                    <div className="card-actions justify-center">
                                        <button
                                            type="submit"
                                            className="w-full mt-3 p-1.5 text-sm text-white font-medium bg-black hover:bg-gold"
                                        >
                                            Register
                                        </button>
                                    </div>
                                    <div className='flex text-sm gap-1'>
                                        <div className='text-black'>Already Have an Account?</div>
                                        <Link href={'/login'} className='text-gold font-semibold'>Login</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )
}
