'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { getTransactions, CreatePayment } from '@/lib/transaction';
import { formatToIDR } from '@/helpers/formatPrice';
import PaymentMethod from './_components/payment-method';
import Image from 'next/image';
import SuccessTransaction from '../../../../../assets/success-transaction.png'
import Link from 'next/link';

type Transaction = {
  id: number;
  status: string;
  usedDiscount: number;
  usedPoint: number;
};

export default function PaymentPage() {
  const params = useParams();
  const transactionIds = params?.transactionIds;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ticketTotalPrice, setTicketTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const ticketStates = localStorage.getItem('ticketStates');
    if (ticketStates) {
      const parsedState = JSON.parse(ticketStates);
      if (parsedState.ticketTotalPrice) {
        setTicketTotalPrice(parsedState.ticketTotalPrice);
      }
    }
  }, []);

  useEffect(() => {
    if (!transactionIds) return;

    const formattedIds = Array.isArray(transactionIds)
      ? transactionIds.map((id) => parseInt(id, 10))
      : transactionIds.split('-').map((id) => parseInt(id, 10));

    if (formattedIds.some(isNaN)) {
      toast.error('Invalid transaction IDs');
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions(formattedIds);
        setTransactions(data.transactions);
      } catch (error) {
        toast.error('Transaction not found!');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [transactionIds]);

  const calculateFinalPrice = (transaction: Transaction) => {
    return (
      ticketTotalPrice -
      transaction.usedPoint -
      (ticketTotalPrice * transaction.usedDiscount) / 100
    );
  };

  return (
    <div className="flex flex-col lg:px-10 lg:gap-10 place-items-center w-full bg-black">
      <div className="card w-full items-center">
        <div className="flex flex-col w-full sm:w-[400px] p-3">
          <h6 className="tracking-widest font-playball text-gold text-xl pb-2">
            Payment Page
          </h6>
          <div className="flex flex-col w-full gap-2 bg-white p-3">
            {loading ? (
              <p className="text-center">
                <span className="loading loading-dots loading-md"></span>
              </p>
            ) : transactions.some((t) => t.status === 'waitingConfirmation') ? (
              <div className="p-3 flex flex-col gap-2 items-center">
                <h6 className='text-lg text-gold font-bold text-center'>Your payment has been successfully processed! </h6>
                <Image src={SuccessTransaction} alt={'Success!'} width={1000} height={500}/>
                <h6 className="p-3 text-justify text-black bg-white">
                Please wait while the event organizer verifies and confirms your transaction. Thank you!
                </h6>
                <Link href={'/'} className='py-1 px-3 bg-gold text-white'>Back to Home</Link>
              </div>
            ) : transactions.length > 0 ? (
              <>
                <div className="p-3 flex flex-col gap-2 items-center">
                  <h6 className="font-bold">Total Payment</h6>
                  <p className="text-2xl font-bold text-gold">
                    {formatToIDR(calculateFinalPrice(transactions[0]))}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold">Metode Pembayaran:</p>
                  <PaymentMethod />
                </div>
                <Formik
                  initialValues={{
                    transactionIds: transactions.map((t) => t.id),
                  }}
                  validationSchema={Yup.object().shape({
                    transactionIds: Yup.array()
                      .min(1, 'At least one transaction is required')
                      .required('Required'),
                  })}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      console.log('Submitting payment for:', values.transactionIds);
                      const result = await CreatePayment(values.transactionIds);
                      toast.success('Payment successful!');
                      console.log('Payment response:', result);
                      setTransactions(result.transactions);
                    } catch (error) {
                      console.error('Error processing payment:', error);
                      toast.error('Payment failed!');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col items-center gap-4">
                      <Field type="hidden" name="transactionIds" />
                      <button
                        type="submit"
                        className="bg-gold text-white px-5 py-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Pay Now'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              <p className="text-center">No transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
