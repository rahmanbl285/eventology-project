import { IMyDiscProps } from '@/types'
import React from 'react'
import DiscCard from './card-discount'

export default function MyDiscount({
    data,
    emptyTitle,
    emptyStateSubtext,
    collectionType
}: IMyDiscProps) {
    
    return (
        <section className='w-full'>
            {Array.isArray(data) && data.length > 0 && data.some(item => item.discount > 0) ? (
                <div className='flex flex-col items-center gap-10'>
                    <ul className='grid grid-cols-1 lg:grid-cols-2 py-5'>
                        {collectionType === "MyDiscount" && data.map((item) => {
                            return (
                                <li key={item.id} className='flex justify-center'>
                                    <DiscCard item={item}/>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ) : (
                <div className='flex flex-col bg-white justify-center p-5 h-40 mt-2 w-full text-center'>
                    <h3 className='font-bold text-gold'>{emptyTitle}</h3>
                    <p className='text-sm '>{emptyStateSubtext}</p>
                </div>
            )}

        </section>
    )
}
