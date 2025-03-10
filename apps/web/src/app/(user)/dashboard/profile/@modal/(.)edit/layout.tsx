'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { MdArrowBackIos } from 'react-icons/md';
import DrawerEditProfile from '../../../_components/profile/edit/drawer-edit';

export default function LayoutEdit({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (pathname.includes('/dashboard/profile/edit')) {
      setIsModalOpen(true);
    }
  }, [pathname]);

  const handleClose = () => {
    setIsModalOpen(false);
    router.replace('/dashboard/profile');
    setTimeout(() => {
      window.location.reload();
    }, 100); 
  };
  
  const handleBack = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
  
    if (pathSegments.length > 2) {
      pathSegments.pop();
      const newPath = `/${pathSegments.join('/')}`;
  
      if (newPath === '/dashboard/profile') {
        handleClose(); 
      } else {
        router.push(newPath);
      }
    } else {
      handleClose(); 
    }
  };
  

  const headerText =
    pathname === '/dashboard/profile/edit/account'
      ? 'Account Information'
      : pathname === '/dashboard/profile/edit'
      ? 'Edit Your Profile'
      : pathname === '/dashboard/profile/edit/account/email'
      ? 'Change Email'
      : pathname === '/dashboard/profile/edit/account/deactivate'
      ? 'Deactivate Account'
      : '';

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} width="w-[750px]" className="bg-black">
      <div className="flex items-center justify-center lg:w-[750px] lg:h-[452px] bg-black">
        <div className="flex w-full h-full lg:max-w-[750px] lg:max-h-[452px] lg:items-center lg:justify-center">
          <div className="flex w-full lg:h-[452px] border-grey justify-center lg:justify-between lg:shadow-md">
            <DrawerEditProfile />
            <div className="flex flex-col w-full pt-7 lg:pl-7 lg:pb-7">
              <div className="flex px-5 items-center justify-between w-full max-w-md lg:p-0">
                <button onClick={handleBack} className="flex items-center lg:hidden">
                  <MdArrowBackIos className="text-white" />
                </button>
                <h1 className="text-lg text-gold font-playball mx-auto lg:m-0">{headerText}</h1>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
