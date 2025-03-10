import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ConfirmOrder } from '@/lib/transaction';

interface ConfirmButtonProps {
  transactionId: string;
  isConfirmed: boolean;
  onConfirmSuccess: (transactionId: string) => void;
}

export default function ConfirmButton({ transactionId, isConfirmed, onConfirmSuccess }: ConfirmButtonProps) {
  return (
    <Formik
      initialValues={{ isConfirmed }}
      validationSchema={Yup.object().shape({ isConfirmed: Yup.boolean() })}
      onSubmit={async (_, { setSubmitting }) => {
        try {
          const response = await ConfirmOrder(transactionId, isConfirmed);
          toast.success(response.message);
          onConfirmSuccess(transactionId); // Hapus transaksi dari tabel setelah sukses
        } catch (error: any) {
          toast.error(error.message || 'Failed to update order status');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <button type="submit" className={isConfirmed ? 'text-[#4CAF50]' : 'text-gold'} disabled={isSubmitting}>
            {isConfirmed ? <FaCheckCircle className='text-lg'/> : <FaTimesCircle className='text-lg'/>}
          </button>
        </Form>
      )}
    </Formik>
  );
}
