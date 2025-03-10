import { defaultBanner } from '@/assets/defaultImage';
import { IFileUploaderProps } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdAddAPhoto, MdDelete } from 'react-icons/md';

export default function ImageEvent({
  image,
  onFieldChange,
  setFiles,
}: IFileUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (image) {
      setPreviewImage(image); 
    } else {
      setPreviewImage(defaultBanner()); 
    }
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
    setPreviewImage(defaultBanner());
    onFieldChange('');
    setFiles(null);
  }

  return (
    <>
      {image ? (
        <div className="flex relative justify-center max-h-52 md:max-h-[350px]">
          <Image
            src={previewImage || defaultBanner()}
            alt={''}
            width={800}
            height={350}
            className="object-cover"
            priority
          ></Image>
          <div className="absolute bottom-4 right-4">
            <div className="flex transform gap-3">
              <button onClick={removePhoto}>
                <MdDelete className="text-2xl fill-black bg-white shadow-sm shadow-grey" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex relative justify-center max-h-52 md:max-h-[350px]">
            <Image
              src={previewImage || defaultBanner()}
              alt={''}
              width={800}
              height={350}
              className="object-cover brightness-75"
              priority
            ></Image>
            <div className="absolute bottom-4 right-4">
              <div className="flex transform gap-3">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
