'use client'

interface iTitleCard {
    title: string
    subtitle: string
}

export default function TitleCard ({title, subtitle}: iTitleCard) {
    return (
        <div className="inline-flex gap-3 px-5 pt-5">
        <div className="flex items-center">
          <h2 className="text-lg text-white font-bold uppercase tracking-widest">
            {title}
          </h2>
        </div>
        <h2 className="playball-regular text-4xl text-gold font-extrabold tracking-wider">
          {subtitle}
        </h2>
      </div>
    )
}