import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IFileUploaderProps } from '@/types';
import { GetUserProfile } from '@/lib/user';

export default function ImageProfileEdit({
  image,
  onFieldChange,
  setFiles,
}: IFileUploaderProps) {
  const placeHolderImage =
    'https://images.unsplash.com/photo-1544502062-f82887f03d1c?q=80&w=1918&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const [previewImage, setPreviewImage] = useState<string>(
    image || placeHolderImage,
  );

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profile = await GetUserProfile();
        console.log('Fetched profile:', profile);
        if (profile.image) {
          setPreviewImage(profile.image);
        } else {
          setPreviewImage(placeHolderImage);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setPreviewImage(placeHolderImage);
      }
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    console.log('Image prop value:', image);
    setPreviewImage(image || placeHolderImage);
  }, [image]);

  function handleFileChange(user: React.ChangeEvent<HTMLInputElement>) {
    const file = user.target.files?.[0];

    if (file) {
      setFiles(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result as string;
        setPreviewImage(fileData);
        onFieldChange(fileData);
      };
      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    setPreviewImage(placeHolderImage);
    onFieldChange('');
    setFiles(null);
  }

  return (
    <>
      <div className="flex relative justify-center h-28 w-28">
        <Image
          src={previewImage}
          alt="Profile Image"
          width={350}
          height={350}
          className="object-cover rounded-full"
          priority
        />
        <div className="absolute bottom-4 right-6">
          <div className="flex transform gap-3">
            {image ? (
              <button
                onClick={removePhoto}
                className="flex bg-white/30 p-3 rounded-full justify-center items-center"
              >
                <MdDelete className="text-xl cursor-pointer" />
              </button>
            ) : (
              <label>
                <div className="flex bg-white/30 p-3 rounded-full justify-center items-center">
                  <FaEdit className="text-xl cursor-pointer" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  name="file"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
