import { ICategory } from "@/types";
import * as yup from "yup";

export const CreatePaymentSchema = yup.object().shape({
  transactionIds: yup.array()
    .of(yup.number().required("Transaction ID is required"))
    .min(1, "At least one transaction must be selected"),
});

export const CreateOrderSchema = yup.object().shape({
    eventsId: yup.number().required('Event ID is required'),
    tickets: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required('Ticket type is required'),
          quantity: yup
            .number()
            .required('Quantity is required')
            .min(1, 'Quantity must be greater than or equal to 1'),
          price: yup
            .number()
            .required('Price is required')
            .min(0, 'Price must be at least 0'),
        }),
      )
      .required('Tickets are required'),
    usedDiscount: yup
      .number()
      .notRequired()
      .min(0, 'Discount must be at least 0'),
    usedPoint: yup.number().notRequired().min(0, 'Points must be at least 0'),
  });

  export const categories = Object.values(ICategory);

  export const CreateEventSchema = yup.object().shape({
    title: yup.string().required('Event title required!'),
    startDate: yup.date().required('Event start date required!'),
    startTime: yup.string().required('Event start time required!'),
    endDate: yup
      .date()
      .min(yup.ref('startDate'), 'End date must be after the start date')
      .required('Event end date required!'),
    endTime: yup.string().required('Event end time required!'),
    description: yup.string().required('Description of event required!'),
    address: yup.string(),
    city: yup.string(),
    province: yup.string(),
    category: yup
      .string()
      .oneOf(categories, 'Event category invalid!')
      .required('Event category required!'),
    tickets: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required('Ticket type is required'),
          availableSeat: yup
            .number()
            .required('Available seats are required')
            .min(1),
          price: yup.number().required('Price is required').min(0),
          startSaleDate: yup.date().required('Sale start date is required'),
          endSaleDate: yup.date().required('Sale end date is required'),
        }),
      )
      .required('At least one ticket is required'),
  });
  
  export const RegisterSchema = yup.object().shape({
    name: yup.string().required('name is required'),
    username: yup.string().required('username is required'),
    email: yup.string().email('invalid e-mail').required('e-mail is required'),
    password: yup
    .string()
    .min(6, 'password must be at least 6 characters')
    .required('password is required'),
    useReferral: yup.string().optional()
})

export const LoginSchema = yup.object().shape({
    email: yup.string().email('invalid e-mail').required('e-mail required'),
    password: yup
      .string()
      .min(6, 'password must be at least 6 characters')
      .required('password required'),
  });

export const UpdateEventSchema = yup.object().shape({
  id: yup.number().notRequired(),
    title: yup.string().notRequired(),
    startDate: yup.date().notRequired(),
    startTime: yup.string().notRequired(),
    endDate: yup.date().min(yup.ref('startDate'), 'End date must be after the start date').notRequired(),
    endTime: yup.string().notRequired(),
    description: yup.string().notRequired(),
    address: yup.string().notRequired(),
    city: yup.string().notRequired(),
    province: yup.string().notRequired(),
    category: yup.string().oneOf(categories, 'Event category invalid!').notRequired(),
    tickets: yup.array().of(
      yup.object().shape({
        type: yup.string().notRequired(),
        availableSeat: yup.number().min(1).notRequired(),
        price: yup.number().min(0).notRequired(),
        startSaleDate: yup.date().notRequired(),
        endSaleDate: yup.date().notRequired(),
      })
    ).notRequired(),
  });
  