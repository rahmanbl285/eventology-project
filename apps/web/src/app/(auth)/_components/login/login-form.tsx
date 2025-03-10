'use client';
import { createToken } from '@/app/action';
import { useAppDispatch } from '@/lib/features/hooks';
import { setUser } from '@/lib/features/user/userSlice';
import { LoginUser } from '@/lib/user';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineMail } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { UserContext } from '@/app/userContext';
import toast from 'react-hot-toast';
import loginBg from '../../../../../public/assets/bglogin.jpg'
import { LoginSchema } from '@/lib/validationSchema';
import Cookies from 'js-cookie';


export default function LoginForm() {
  const search = useSearchParams();
  const router = useRouter()
  const redirect = search.get('redirect') || '/';
  const dispatch = useAppDispatch();
  const { setUserInfo } = useContext<any>(UserContext);

  const onLogin = async (data: any) => {
    try {
      const res = await LoginUser(data);
      
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Login failed');
      }
      dispatch(setUser(res.users));
      toast.success('Login successful')
      setTimeout(() => {
        Cookies.set('token', res.token, { expires: 1 });
        router.push(redirect)
        setUserInfo(res);
      }, 2000);
    } catch (err: any) {
      toast.error(err.message)
    }
  };

  const [show, setShow] = useState(false);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, action) => {
        onLogin(values);
        action.resetForm();
      }}
    >
      {() => {
        return (
          <Form>
            <div className="flex bg-cover bg-center justify-center items-center min-h-svh w-full" style={{ backgroundImage: `url(${loginBg.src})` }}>
              <div className="card bg-white rounded-none w-96 ">
                <div className="card-body">
                  <div className="flex flex-col items-center pb-5">
                    <h1 className="card-title text-black text-3xl">Welcome</h1>
                    <p className="text-sm text-grey">Login to your account</p>
                  </div>
                  <div className="relative">
                    <Field
                      name="email"
                      type="text"
                      placeholder="Email"
                      className="block bg-transparent text-black w-full placeholder:text-grey placeholder:text-xs border border-black  p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                    />
                    <AiOutlineMail className="absolute left-2 top-2.5 text-black" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-xs text-gold font-bold tracking-wider mt-1"
                    />
                  </div>
                  <div className="relative">
                    <Field
                      name="password"
                      type={show ? 'text' : 'password'}
                      placeholder="Password"
                      className="block bg-transparent placeholder:text-grey placeholder:text-xs text-black w-full  border border-black p-1.5 pl-10 pr-10 shadow-sm sm:text-sm sm:leading-6"
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
                      className="text-xs text-gold font-bold tracking-wider mt-1"
                    />
                  </div>
                  <div className="flex text-sm text-black justify-end w-full">
                    <Link href={'/forgot-password'}>Forgot Password?</Link>
                  </div>

                  <div className="card-actions justify-center">
                    <button
                      type="submit"
                      className="w-full mt-3 p-1.5 text-sm text-white font-medium  bg-black hover:text-white hover:bg-gold"
                    >
                      Login
                    </button>
                  </div>
                  <div className="flex text-sm gap-1">
                    <div className="text-black">Dont have an account?</div>
                    <Link href={'/register'} className="text-gold font-semibold">
                      Create an Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
