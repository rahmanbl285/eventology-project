'use client';

import { useEffect, useState } from 'react';
import ImageEventUpdate from '../../../_components/eventsSlug/image-update-event';
import { defaultBanner } from '@/assets/defaultImage';
import {
  getCities,
  GetEventSlug,
  getProvinces,
  UpdateEvent,
} from '@/lib/event';
import { useParams } from 'next/navigation';
import { ITicket } from '@/types';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { categories, UpdateEventSchema } from '@/lib/validationSchema';
import { LucideTicketPlus } from 'lucide-react';
import { FaTrash } from 'react-icons/fa6';

interface Province {
  id: string;
  name: string;
}

export default function UpdateEventForm() {
  const [image, setImage] = useState<string>(defaultBanner());
  const [file, setFile] = useState<File | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      if (Array.isArray(data)) {
        setProvinces(data);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (selectedProvince: string) => {
    try {
      const response = await getCities(selectedProvince);
      console.log('Cities response:', response);
      if (response && Array.isArray(response.data)) {
        setCities(response.data.map((city: { name: string }) => city.name));
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    }
  };

  const [initialValues, setInitialValues] = useState({
    id: 0,
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    description: '',
    address: '',
    city: '',
    provinces: '',
    category: '',
    tickets: [
      {
        type: '',
        availableSeat: 0,
        price: 0,
        startSaleDate: '',
        endSaleDate: '',
      },
    ],
  });

  useEffect(() => {
    const fetchEventSlug = async () => {
      const response = await GetEventSlug(undefined, slug as string);
      const event = response?.event;

      try {
        setInitialValues({
            id: event?.id || 0,
          title: event?.title || '',
          startDate: event?.startDate
            ? new Date(event.startDate).toISOString().split('T')[0]
            : '',
          startTime: event?.startDate
            ? event.startDate.split('T')[1].substring(0, 5)
            : '', 
          endDate: event?.endDate
            ? new Date(event.endDate).toISOString().split('T')[0]
            : '',
          endTime: event?.endDate
            ? event.endDate.split('T')[1].substring(0, 5)
            : '', 

          description: event?.description || '',
          address: event?.address || '',
          city: event?.city || '',
          provinces: event?.provinces || '',
          category: event?.category || '',
          tickets:
            event?.Tickets?.length > 0
              ? event.Tickets.map((ticket: ITicket) => ({
                  type: ticket.type || '',
                  availableSeat: ticket.availableSeat || 0,
                  price: ticket.price || 0,
                  startSaleDate: ticket?.startSaleDate
                  ? new Date(ticket.startSaleDate).toISOString().split('T')[0]
                  : '',
                  endSaleDate: ticket?.endSaleDate
                  ? new Date(ticket.endSaleDate).toISOString().split('T')[0]
                  : '',
                }))
              : [
                  {
                    type: '',
                    availableSeat: 0,
                    price: 0,
                    startSaleDate: '',
                    endSaleDate: '',
                  },
                ],
        });
        setImage(
          event?.image && event.image.trim() !== ''
            ? event.image
            : defaultBanner(),
        );
      } catch (err) {
        console.error(err);
        setImage(defaultBanner());
      }
    };

    if (slug) {
      fetchEventSlug();
    }
  }, [slug]);

  const onUpdate = async (data: any) => {
    try {
      const startDate = new Date(`${data.startDate}T${data.startTime}`);
      const endDate = new Date(`${data.endDate}T${data.endTime}`);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date format');
        return;
      }
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('startDate', startDate.toISOString());
      formData.append('endDate', endDate.toISOString());
      if (file) {
        formData.append('file', file);
      }
      formData.append('description', data.description);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('category', data.category);
      data.tickets.forEach((ticket: any, index: number) => {
        Object.keys(ticket).forEach((key) => {
          formData.append(`tickets[${index}][${key}]`, ticket[key]);
        });
      });

      const res = await UpdateEvent(formData, data.id);

      if (res.status !== 'OK') {
        throw new Error(res.message || 'Edit Event failed');
      }

      toast.success('Edit Event Successfull!');
    } catch (err: any) {
      toast.error(err.message);
      console.error(JSON.stringify(err, null, 2));
      
    }
  };

  const handleFieldChange = (url: string) => {
    setImage(url);
  };

  const saveImageChange = () => {
    if (image) {
      handleFieldChange(image);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={UpdateEventSchema}
      enableReinitialize
      onSubmit={(values, action) => {
        console.log(values);
        saveImageChange();
        onUpdate({ ...values, image, id: values.id });
      }}
    >
      {({ values }) => {
        return (
          <Form>
            <div className="flex py-20 flex-col bg-cover bg-center  md:flex-row w-full gap-3 md:gap-10 justify-center md:px-2 bg-black">
              <div className="card card-compact  rounded-sm bg-white shadow-xl">
                <ImageEventUpdate
                  image={image}
                  onFieldChange={handleFieldChange}
                  setFiles={setFile}
                />
                <div className="card-body my-7 w-full">
                  <p className="text-gold tracking-wide font-semibold">
                    Make it Special: Event Name and Category
                  </p>
                  <div className="flex flex-col gap-1">
                    <label className="input input-bordered focus-within:outline-none rounded-none flex w-full items-center gap-2">
                      <Field
                        name="title"
                        placeholder="Event Name"
                        type="text"
                        className="grow"
                      />
                      <ErrorMessage
                        name="title"
                        component={'div'}
                        className="text-xs font-bold text-gold"
                      />
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="select focus-within:outline-none rounded-none select-bordered bg-white w-full"
                    >
                      <option disabled value="">
                        Choose Event Category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component={'div'}
                      className="text-xs font-bold text-gold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-5 pt-3">
                      <div className="flex flex-col text-gold text-nowrap w-full gap-2 ">
                        <p className="text-gold tracking-wide font-semibold">
                          Set the Stage: Event Start Date and Time
                        </p>
                        <div className="flex gap-5">
                          <Field
                            name="startDate"
                            type="date"
                            className="input input-md border border-b-grey rounded-none w-full"
                          />
                          <ErrorMessage
                            name="startDate"
                            component={'div'}
                            className="text-xs text-gold"
                          />
                          <Field
                            name="startTime"
                            type="time"
                            className="input input-md border border-b-grey rounded-none w-full"
                          />
                          <ErrorMessage
                            name="startTime"
                            component={'div'}
                            className="text-xs text-gold"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col text-gold text-nowrap w-full gap-2">
                        <p className="text-gold tracking-wide font-semibold">
                          Wrap it Up: Event End Date and Time
                        </p>
                        <div className="flex gap-5">
                          <Field
                            name="endDate"
                            type="date"
                            className="input input-md border border-b-grey rounded-none w-full"
                          />
                          <ErrorMessage
                            name="endDate"
                            component={'div'}
                            className="text-xs text-gold"
                          />
                          <Field
                            name="endTime"
                            type="time"
                            className="input input-md border border-b-grey rounded-none w-full"
                          />
                          <ErrorMessage
                            name="endTime"
                            component={'div'}
                            className="text-xs text-gold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch text-gold text-nowrap w-full gap-2 pt-3">
                    <p className="text-gold tracking-wide font-semibold">
                      The Spot: Event Province, City, and Address
                    </p>
                    <div className="flex gap-5">
                      <div className="flex flex-col w-full">
                        <p className="text-gold">Province</p>
                        <Field
                          name="province"
                          as="select"
                          className="select focus-within:outline-none rounded-none border border-b-grey bg-white h-full w-full"
                          onChange={(e: any) => {
                            const selectedProvince = e.target.value;
                            handleProvinceChange(selectedProvince);
                          }}
                        >
                          <option value="">Choose the province</option>
                          {provinces.length > 0 ? (
                            provinces.map((province) => (
                              <option key={province.id} value={province.id}>
                                {province.name}
                              </option>
                            ))
                          ) : (
                            <option>Province not available</option>
                          )}
                        </Field>
                        <ErrorMessage
                          name="province"
                          component={'div'}
                          className="text-xs text-gold"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-gold">City</p>
                        <Field
                          name="city"
                          as="select"
                          className="select focus-within:outline-none rounded-none border border-b-grey bg-white h-full w-full"
                        >
                          <option disabled value="">
                            Choose the city
                          </option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="city"
                          component={'div'}
                          className="text-xs text-gold"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gold">Address</p>
                      <label className="input input-bordered focus-within:outline-none rounded-none flex w-full items-center gap-2">
                        <Field
                          name="address"
                          placeholder="Where's Your Event Happening?"
                          type="text"
                          className="grow"
                        />
                        <ErrorMessage
                          name="address"
                          component={'div'}
                          className="text-xs font-bold text-gold"
                        />
                      </label>
                    </div>
                    <div className="flex flex-col items-stretch text-nowrap w-full gap-2 pt-3">
                      <p className="text-gold tracking-wide font-semibold">
                        Craft the Ticket to Your Event
                      </p>
                      <FieldArray
                        name="tickets"
                        render={(arrayHelpers) => (
                          <>
                            {values.tickets.map((ticket, index) => (
                              <div key={index} className="flex flex-col gap-3">
                                <div className="flex flex-col gap-3">
                                  <p className="text-gold">
                                    Customize Your Ticket Name
                                  </p>
                                  <Field
                                    name={`tickets[${index}][type]`}
                                    placeholder="Ticket Name"
                                    className="input input-md border border-b-grey rounded-none w-full"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <div className="flex flex-col w-full">
                                    <p className="text-gold">Ticket Price</p>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                        Rp
                                      </span>
                                      <Field
                                        name={`tickets[${index}][price]`}
                                        type="number"
                                        placeholder="Price"
                                        className="input input-md border border-b-grey rounded-none w-full pl-10 focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <p className="text-gold">Available Seats</p>
                                    <Field
                                      name={`tickets[${index}][availableSeat]`}
                                      type="number"
                                      placeholder="Available Seats"
                                      className="input input-md border border-b-grey rounded-none w-full focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <div className="flex flex-col w-full">
                                    <p className="text-gold">
                                      Start: Sale Date
                                    </p>
                                    <Field
                                      name={`tickets[${index}][startSaleDate]`}
                                      type="date"
                                      className="input input-md border border-b-grey rounded-none w-full"
                                    />
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <p className="text-gold">End: Sale Date</p>
                                    <Field
                                      name={`tickets[${index}][endSaleDate]`}
                                      type="date"
                                      className="input input-md border border-b-grey rounded-none w-full"
                                    />
                                  </div>
                                  {values.tickets.length > 1 && (
                                    <div className="flex items-end border-none">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                        className="btn border-none rounded-none bg-white tracking-wider text-white"
                                      >
                                        <FaTrash className="fill-black" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="flex w-full justify-center items-center">
                              <button
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push({
                                    type: '',
                                    availableSeat: 0,
                                    price: 0,
                                    startSaleDate: '',
                                    endSaleDate: '',
                                  })
                                }
                                className="btn w-24 border-none shadow-none bg-white tracking-wide rounded-none"
                              >
                                <LucideTicketPlus className="stroke-black " />
                              </button>
                            </div>
                          </>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-gold tracking-wide font-semibold">
                        Share the Details: Event Description
                      </p>
                      <label className="form-control">
                        <Field
                          name="description"
                          as="textarea"
                          className="textarea textarea-bordered rounded-none w-full h-32 p-2 focus:outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-center w-full">
                  <button
                    type="submit"
                    className="btn uppercase hover:text-gold hover:bg-white text-white bg-gold w-full rounded-none border-none "
                  >
                    Update Event
                  </button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
