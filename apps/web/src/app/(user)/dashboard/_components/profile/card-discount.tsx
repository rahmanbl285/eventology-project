import { IDiscount } from "@/types";

type DataProps = {
    item: IDiscount
}

export default function DiscCard({item}: DataProps) {
    const expiredDiscount = new Date (item.expiredDiscount)
    const options:any = { year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = expiredDiscount.toLocaleDateString('en-US', options)
  return (
      <div className="card rounded-none bg-white w-full">
        <div className="card-body items-center">
          <h2 className="card-title sm:text-nowrap">Discount Voucher</h2>
          <h1 className="text-3xl font-bold">{item.discount}%</h1>
          <p className="text-sm">Expired on {formattedDate}</p>
          </div>
        </div>

  );
}
