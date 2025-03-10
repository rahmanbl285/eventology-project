import { formatToIDR } from "@/helpers/formatPrice";
import type { ICardDashboard } from "@/types";

export default function CardDashboard({title, num, ket}: ICardDashboard) {
  return (
    <>
      <div className="card rounded-none w-full shadow-xl border border-white">
        <div className="card-body gap-4">
          <h2 className="card-title font-playball font-normal tracking-wider text-gold">{title}</h2>
          <hr className="text-white"/>
          <div className="flex gap-3 items-end">
            {
              title !== 'Total Penjualan' ? (
                <h1 className="text-3xl text-white font-bold">{num}</h1>
              ) : (
                <h1 className="text-3xl text-white font-bold">{formatToIDR(num)}</h1>
              )
            }
            <h2 className="text-xl text-white">{ket}</h2>
          </div>
        </div>
      </div>
    </>
  );
}
