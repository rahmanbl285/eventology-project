'use client';

import { UpdatePassword } from '@/lib/user';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { FaKey } from 'react-icons/fa6';
import * as yup from 'yup';

const UpdatePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().required('New password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('newPassword')], 'Password must match'),
});

export default function ChangePasswordForm() {

  const onEditPassword = async (data: any) => {
    try {
      const res = await UpdatePassword(data);
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Edit Password Failed');
      }
      toast.success('Change password successful!');
    } catch (err: any) {
      console.log('error update password: ', err);
      toast.error(err.message);
    }
  };

  return (
    <Formik
      initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={(values, actions) => {
        onEditPassword(values);
        actions.resetForm();
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 p-5 lg:pt-3 lg:pl-0 lg:pr-7">
            <div>
                <h3 className="text-lg font-playball tracking-wider text-gold">Change Password</h3>
                <p className="text-grey text-xs">
                Please enter your current password and new password.
                </p>
            </div>
            <div className='flex flex-col gap-5'>
            <div className="relative">
              <Field
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                className="block bg-transparent text-white w-full rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
              />
              <FaKey className="absolute left-3 top-3 text-white" />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="text-xs text-gold mt-1"
              />
            </div>
            <div className="relative">
              <Field
                name="newPassword"
                type="password"
                placeholder="New Password"
                className="block bg-transparent text-white w-full rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
              />
              <FaKey className="absolute left-3 top-3 text-white" />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-xs text-gold mt-1"
              />
            </div>
            <div className="relative">
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="block bg-transparent text-white w-full rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
              />
              <FaKey className="absolute left-3 top-3 text-white" />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-xs text-gold mt-1"
              />
            </div>
            </div>
            <div className="card-actions justify-center mt-4">
              <button
                type="submit"
                className="w-full py-2 px-3 text-sm text-white hover:text-gold font-medium bg-gold hover:bg-white"
              >
                Change Password
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
