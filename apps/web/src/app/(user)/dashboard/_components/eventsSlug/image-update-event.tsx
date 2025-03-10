'use client'

import { defaultBanner } from '@/assets/defaultImage';
import { IFileUploaderProps } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdAddAPhoto, MdDelete } from 'react-icons/md';
import { GetEventSlug } from '@/lib/event';
import { useParams } from 'next/navigation';

export default function ImageEventUpdate({
  image,
  onFieldChange,
  setFiles,
}: IFileUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;

    const getEventSlug = async () => {
      try {
        const event = await GetEventSlug(undefined, slug as string);

        if (event && event.image) {
          setPreviewImage(event.image);
        } else {
          setPreviewImage(defaultBanner());
        }
      } catch (err) {
        console.error(err);
        setPreviewImage(defaultBanner());
      } finally {
        setIsLoading(false); // Setelah proses selesai, loading false
      }
    };

    getEventSlug();
  }, [slug]);

  useEffect(() => {
    if (image) {
      setPreviewImage(image);
    } else if (previewImage === null) {
      setPreviewImage(defaultBanner());
    }
  }, [image, previewImage]);

  function handleFileChange(user: React.ChangeEvent<HTMLInputElement>) {
    const file = user.target.files?.[0];

    if (file) {
      setFiles(file);
      setIsLoading(true); 
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result as string;
        setPreviewImage(fileData);
        onFieldChange(fileData);
        setIsLoading(false); 
      };
      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    setPreviewImage(defaultBanner());
    onFieldChange('');
    setFiles(null);
  }

  return (
    <div className="relative flex justify-center max-h-52 md:max-h-[350px]">
      {isLoading ? (
        <div className="w-[800px] h-[350px] bg-gray-300 skeleton rounded-md"></div>
      ) : (
        <Image
          src={previewImage || defaultBanner()}
          alt="Event Image"
          width={800}
          height={350}
          className="object-cover"
          priority
          onLoad={() => setIsLoading(false)} 
        />
      )}

      <div className="absolute bottom-4 right-4">
        <div className="flex transform gap-3">
          {previewImage && previewImage !== defaultBanner() ? (
            <button onClick={removePhoto}>
              <MdDelete className="text-2xl fill-black bg-white shadow-sm shadow-grey" />
            </button>
          ) : (
            <label>
              <MdAddAPhoto className="text-2xl fill-white cursor-pointer" />
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
  );
}
