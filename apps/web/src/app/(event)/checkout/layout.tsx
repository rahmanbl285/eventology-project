'use client';

import { useState, useEffect, useMemo } from 'react';

export default function LayoutCheckout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const SESSION_EXPIRATION_TIME = useMemo(() => 24 * 60 * 60 * 1000, [] ) ;
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_EXPIRATION_TIME);

  useEffect(() => {
    const savedTimestamp = localStorage.getItem('ticketStateTimestamp');

    if (savedTimestamp) {
      const timestamp = Number(savedTimestamp);

      const updateTimer = () => {
        const currentTime = Date.now();
        const timePassed = currentTime - timestamp;
        const remainingTime = SESSION_EXPIRATION_TIME - timePassed;

        if (remainingTime <= 0) {
          localStorage.removeItem('ticketStates');
          localStorage.removeItem('ticketStateTimestamp');
          setTimeLeft(0);
        } else {
          setTimeLeft(remainingTime);
        }
      };

      updateTimer(); 

      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeLeft(0);
    }
  }, [SESSION_EXPIRATION_TIME]); 

  const formatTime = (timeInMs: number) => {
    const hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    const seconds = Math.floor((timeInMs / 1000) % 60);
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <>
      <div className="flex flex-col sm:flex-row bg-black items-center justify-between">
        <div className="flex gap-4 items-center h-20 p-5">
          <h1 className="text-white tracking-[0.25em]">eventology</h1>
          <div className="border border-white border-l-0 h-8" />
          <h1 className="text-white font-bold font-roboto tracking-[0.2em]">
            CHECK<span className="text-gold">OUT</span>
          </h1>
        </div>
        <p className="text-white tracking-wider p-5 text-center">
          Segera <span className="text-gold font-bold">selesaikan</span>{' '}
          pesananmu{' '}
          <span className="border border-white border-l-0 h-4 mx-3"></span>{' '}
          {hours} jam {minutes} menit {seconds} detik
        </p>
        {timeLeft === 0 && <p>Waktu habis! Sesi checkout telah berakhir.</p>}
      </div>
      {children}
    </>
  );
}
