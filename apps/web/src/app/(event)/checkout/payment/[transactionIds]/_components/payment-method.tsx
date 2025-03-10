'use client'

import { BiTransferAlt } from "react-icons/bi"
import BCA from '../../../../../../assets/logo/bca-bank-central-asia.svg'
import TransferBank from '../../../../../../assets/logo/transfer bank.svg'
import Indomaret from '../../../../../../assets/logo/indomaret.svg'
import Gopay from '../../../../../../assets/logo/gopay.svg'
import ShopeePay from '../../../../../../assets/logo/spay.svg'
import Image from "next/image"
import { FaWallet } from "react-icons/fa6"

export default function PaymentMethod() {
    return (
        <>
        <div className="join join-vertical w-full">
                    <div className="collapse collapse-arrow join-item">
                      <input
                        type="radio"
                        name="my-accordion-4"
                        defaultChecked
                      />
                      <div className="collapse-title text-xl font-medium">
                        <span className="label-text inline-flex gap-3 items-center">
                          <BiTransferAlt className="bg-gold rounded-full fill-white text-lg" />
                          Virtual Account
                        </span>
                      </div>
                      <div className="collapse-content">
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <span className="label-text inline-flex gap-3 items-center">
                              <Image src={BCA} width={30} height={30} alt="BCA"/>BCA
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio checked:bg-gold"
                              defaultChecked
                            />
                          </label>
                          <label className="label cursor-pointer">
                            <span className="label-text inline-flex gap-3 items-center">
                              <Image src={TransferBank} width={30} height={30} alt="Transfer Bank"/>Transfer Bank
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio checked:bg-gold"
                              defaultChecked
                            />
                          </label>
                          <label className="label cursor-pointer">
                            <span className="label-text inline-flex gap-3 items-center">
                            <Image src={Indomaret} width={30} height={30} alt="Indomaret"/>Indomaret
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio checked:bg-gold"
                              defaultChecked
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="collapse collapse-arrow join-item ">
                      <input type="radio" name="my-accordion-4" />
                      <div className="collapse-title">
                      <span className="label-text inline-flex gap-3 items-center">
                          <FaWallet className="fill-gold text-lg" />
                          E-Money
                        </span>                      
                    </div>
                      <div className="collapse-content">
                      <label className="label cursor-pointer">
                            <span className="label-text inline-flex gap-3 items-center">
                            <Image src={Gopay} width={30} height={30} alt="Gopay"/>Gopay
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio checked:bg-gold"
                              defaultChecked
                            />
                          </label>
                          <label className="label cursor-pointer">
                            <span className="label-text inline-flex gap-3 items-center">
                            <Image src={ShopeePay} width={30} height={30} alt="Shopee Pay"/>Shopee Pay
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio checked:bg-gold"
                              defaultChecked
                            />
                          </label>
                      </div>
                    </div>
                  </div>
        </>
    )
}