'use client'

import Image from 'next/image'
import ads from '../../../assets/ads-gepeng2.jpg'

export default function AdsHero () {
    return (
        <>
            <div className='w-full h-36 md:h-full p-5  bg-black'>
                <Image
                    src={ads.src}
                    alt={'ads'}
                    width={1500}
                    height={700}
                    className='brightness-75 h-full object-cover'
                />
            </div>
        </>
    )
}