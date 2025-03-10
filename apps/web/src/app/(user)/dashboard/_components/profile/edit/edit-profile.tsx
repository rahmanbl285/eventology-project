'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { EditUserProfile, GetUserProfile } from '@/lib/user';
import {
  MdOutlineDriveFileRenameOutline,
} from 'react-icons/md';
import { FaUser } from 'react-icons/fa6';
import ImageProfileEdit from '@/app/(user)/dashboard/_components/profile/edit/image-edit';
import toast from 'react-hot-toast';

const EditProfileSchema = yup.object().shape({
  name: yup.string().notRequired(),
  username: yup.string().notRequired(),
});

const placeholder =
'https://images.unsplash.com/photo-1544502062-f82887f03d1c?q=80&w=1918&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';


export default function EditProfileForm() {
  const [image, setImage] = useState<string>(placeholder);
  const [file, setFile] = useState<File | null>(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    username: '',
  });
  const [placeholders, setPlaceholders] = useState({
    name: 'Name',
    username: 'Username',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await GetUserProfile();
      try {
        setInitialValues({
          name: profile.name || '',
          username: profile.username || '',
        });
        setPlaceholders({
          name: profile.name || 'Name',
          username: profile.username || 'Username',
        });
        setImage(profile.image || placeholder);
      } catch (err) {
        console.log(err);
        setImage(profile.image)
      }
    };

    fetchUserProfile();
  }, []);

  const onEdit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.set('name', data.name);
      formData.set('username', data.username);
      if (file) {
        formData.set('file', file);
      }
      const res = await EditUserProfile(formData, token || '')
      if (res.status !== 'OK') {
        throw new Error(res.message || 'Edit Profile failed');
      }
      toast.success('Edit Profile Successfull!');
      router.push('/dashboard/profile');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFieldChange = (url: string) => {
    setImage(url);
  };

  const saveImageChange = () => {
    if (image) {
      handleFieldChange(image);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EditProfileSchema}
      enableReinitialize
      onSubmit={(values, action) => {
        console.log(values);
        saveImageChange();
        onEdit({ ...values, image });
      }}
    >
      {() => {
        return (
          <Form>
            <div className="flex flex-col bg-black">
              <p className="hidden lg:flex text-white lg:text-xs lg:pb-5">
                Change your profile at any time.
              </p>
              <div className="flex flex-col items-center justify-center h-[75vh] lg:h-auto">
                <div className="flex flex-col justify-center items-center h-full lg:h-auto gap-3">
                  <ImageProfileEdit
                    image={image}
                    onFieldChange={handleFieldChange}
                    setFiles={setFile}
                  />
                  <div className="relative">
                    <p className="text-sm text-white">name</p>
                    <Field
                      name="name"
                      type="text"
                      placeholder={placeholders.name}
                      className="block bg-transparent text-white w-full lg:w-96 rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                    />
                    <MdOutlineDriveFileRenameOutline className="absolute left-3 top-8 text-white" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-xs text-gold mt-1"
                    />
                  </div>
                  <div className="relative">
                    <p className="text-sm text-white">username</p>
                    <Field
                      name="username"
                      type="text"
                      placeholder={placeholders.username}
                      className="block bg-transparent text-white w-full lg:w-96 rounded-sm border border-grey p-1.5 pl-10 shadow-sm sm:text-sm sm:leading-6"
                    />
                    <FaUser className="absolute text-sm left-3 top-8 text-white" />

                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-xs text-gold mt-1"
                    />
                  </div>
                  <div className="card-actions justify-center">
                    <button
                      type="submit"
                      className="w-full mt-3 py-2 px-3 text-sm text-white font-medium bg-gold hover:bg-white hover:text-gold"
                    >
                      Save Changes
                    </button>
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
