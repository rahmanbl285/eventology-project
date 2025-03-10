'use client';

import { ModalProps } from '@/types';
import { MouseEventHandler, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Modal({ isOpen, onClose, children, width, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const handleOverlayClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center transition-opacity"
    >
      <div className={`p-6 rounded-sm shadow-lg ${className ? className : 'bg-white'} ${width ? width : isDesktop ? 'w-80' : 'w-80'}`}>
        {children}
      </div>
    </div>
  );
}
