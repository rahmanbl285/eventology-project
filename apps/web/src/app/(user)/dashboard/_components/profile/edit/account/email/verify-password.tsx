'use client';

import { UpdateEmail, VerifPassword } from '@/lib/user';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { FaKey } from 'react-icons/fa6';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import * as yup from 'yup';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import checkYourEmail from '../../../../../../../../assets/check-your-email.jpg';

const VerifyPasswordSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
});

const UpdateEmailSchema = yup.object().shape({
  newEmail: yup.string().email('Invalid email address').notRequired(),
});

export default function ChangeEmailModal() {
  const [step, setStep] = useState('verify');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onVerifyPassword = async (data: any) => {
    try {
      const res = await VerifPassword(data);
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Wrong Password!');
      }
      toast.success('Verify password successful!');
      setTimeout(() => setStep('update'), 2000);
    } catch (err: any) {
      console.log('error verify password:', err);
      toast.error(err.message);
    }
  };

  const onEditEmail = async (data: any) => {
    try {
      const res = await UpdateEmail(data);
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Edit Email failed');
      }
      setStep('confirm');
    } catch (err: any) {
      console.log('error edit email:', err);
      toast.error(err.message);
    }
  };

  const initialValues = {
    password: '',
    newEmail: '',
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
        Update Email Address
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="bg-black text-white w-96"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={
            step === 'verify' ? VerifyPasswordSchema : UpdateEmailSchema
          }
          onSubmit={(values) => {
            if (step === 'verify') {
              onVerifyPassword(values);
            } else if (step === 'update') {
              onEditEmail(values);
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
                  <p className="py-4">Re-enter your password to continue.</p>
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
                  <div className="flex justify-end mt-4">
                    {inputPassword ? (
                      <button
                        className="py-2 px-5 rounded-sm bg-gold text-white"
                        type="submit"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="py-2 px-5 rounded-sm bg-white text-black"
                        type="button"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              )}

              {step === 'update' && (
                <>
                  <h3 className="font-bold text-lg text-gold tracking-wider">
                    Update Email
                  </h3>
                  <p className="py-4">Enter your new email address.</p>
                  <div className="relative">
                    <Field
                      name="newEmail"
                      type="email"
                      placeholder="email"
                      className="block bg-transparent text-white w-full rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                      onChange={(e: any) => {
                        handleInput(e);
                        setFieldValue('newEmail', e.target.value);
                      }}
                    />
                    <MdOutlineDriveFileRenameOutline className="absolute left-3 top-3 text-white" />
                    <ErrorMessage
                      name="newEmail"
                      component="div"
                      className="text-xs text-gold mt-1"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="py-2 px-5 rounded-sm bg-gold text-white"
                      type="submit"
                    >
                      Change Email
                    </button>
                  </div>
                </>
              )}

              {step === 'confirm' && (
                <>
                  <div className="flex w-full justify-center items-center">
                    <Image
                      src={checkYourEmail}
                      alt="Check your email"
                      height={400}
                      width={400}
                    />
                  </div>
                  <p className="py-4 text-xs text-justify">
                    We have received a request to update your email address. To
                    complete this process, please check your inbox and follow
                    the instructions in the verification email we have sent you.
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      className="py-2 px-5 rounded-sm bg-gold text-white"
                      type="button"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
