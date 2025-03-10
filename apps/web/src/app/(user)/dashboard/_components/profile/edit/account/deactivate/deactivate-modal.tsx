'use client';

import { DeactivateAccount, VerifPassword } from '@/lib/user';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { FaKey } from 'react-icons/fa6';
import * as yup from 'yup';
import deactivate from '../../../../../../../../assets/deactivate.jpg';
import Image from 'next/image';
import { deleteToken } from '@/app/action';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';

const VerifyPasswordSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
});

export default function DeactivateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('verify');
  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setStep('verify'); // Reset step saat modal ditutup
  };

  const onVerifyPassword = async (data: any) => {
    try {
      const res = await VerifPassword(data);
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Wrong Password!');
      }
      toast.success('Verify password successful!');
      setTimeout(() => {
        setStep('deactivate');
      }, 2000);
    } catch (err: any) {
      console.log('error verify password: ', err);
      toast.error(err.message);
    }
  };

  const onDeactivate = async (data: any) => {
    try {
      const res = await DeactivateAccount(data);
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Deactivate Failed!');
      }
      setTimeout(() => {
        toast.success('Deactivate successfully!');
        setStep('confirm');
      }, 1000);
    } catch (err: any) {
      console.log('error deactivate: ', err);
      toast.error(err.message);
    }
  };

  if (step === 'confirm') {
    setTimeout(() => {
      deleteToken('token');
      localStorage.removeItem('token');
      Cookies.remove('token');
      router.push('/');
    }, 4000);
  }

  const initialValues = {
    password: '',
  };

  const [inputPassword, setInputPassword] = useState('');
  const handleInput = (e: any) => {
    setInputPassword(e.target.value);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="py-2 px-5 rounded-sm bg-gold text-white"
      >
        Deactivate Account
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="bg-black p-8 rounded-lg w-96"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={VerifyPasswordSchema}
          onSubmit={(values) => {
            if (step === 'verify') {
              onVerifyPassword(values);
            } else if (step === 'deactivate') {
              onDeactivate(values);
            }
          }}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              {step === 'verify' && (
                <>
                  <h3 className="font-bold text-lg text-gold tracking-wider">
                    Verify your password
                  </h3>
                  <p className="py-4 text-white">
                    Re-enter your password to continue.
                  </p>
                  <div className="relative">
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="block bg-transparent text-white w-full rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                      onChange={(e: any) => {
                        handleInput(e);
                        setFieldValue('password', e.target.value);
                      }}
                    />
                    <FaKey className="absolute left-3 top-3 text-white" />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs text-gold mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    {inputPassword ? (
                      <button
                        className="py-2 px-5 rounded-sm bg-gold text-white"
                        type="submit"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="py-2 px-5 rounded-sm bg-gold text-white"
                        type="button"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              )}
              {step === 'deactivate' && (
                <>
                  <h1 className="text-lg font-bold text-white">
                    Are you sure you want to deactivate your account?
                  </h1>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="py-2 px-5 rounded-sm bg-white text-gold"
                      type="button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="py-2 px-5 rounded-sm bg-gold text-white"
                      type="submit"
                    >
                      Deactivate
                    </button>
                  </div>
                </>
              )}
              {step === 'confirm' && (
                <>
                  <div className="flex w-full justify-center items-center bg-black">
                    <Image
                      src={deactivate}
                      alt="Deactivated"
                      height={400}
                      width={400}
                    />
                  </div>
                  <p className="py-4 font-semibold text-justify text-white">
                    You have successfully deactivated your account!
                  </p>
                </>
              )}
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
