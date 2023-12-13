'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface FormValues {
    address: string;
    cardHolder: string;
    cardNumber: string;
}

export default function CheckoutForm() {
    const router = useRouter();
    const { data: session } = useSession({ required: true });
    const [error, setError] = useState<string>('');
    const [formValues, setFormValues] = useState<FormValues>({
        address: '',
        cardHolder: '',
        cardNumber: '',
    });

    const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            return false;
        }

        const res = await fetch(`/api/users/${session!.user._id}/orders`,
            {
                method: 'POST',
                body: JSON.stringify(formValues),
            });

        if (res.ok) {
            setError('');
            router.push('/');
            router.refresh();
        } else {
            setError('An error occurred while processing your request. Please try again later.')
        }
    };

    const isFormValid = formValues.address && formValues.cardHolder && formValues.cardNumber;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid sm:gap-6 py-10 mx-0 min-w-full flex flex-col sm:grid-cols-2">
                    <div className="sm:col-span-2 py-2">
                        <label htmlFor="saddress" className="block mb-2 text-sm font-medium text-gray-900">Shipping address</label>
                        <input
                            value={formValues.address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormValues((prevFormValues) => ({
                                    ...prevFormValues,
                                    address: e.target.value,
                                }))
                            }
                            type="text"
                            name="saddress"
                            id="saddress"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="221b Baker, St, London, UK"
                            required />
                    </div>
                    <div className="w-full py-2">
                        <label htmlFor="holder" className="block mb-2 text-sm font-medium text-gray-900">Card Holder</label>
                        <input
                            value={formValues.cardHolder}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormValues((prevFormValues) => ({
                                    ...prevFormValues,
                                    cardHolder: e.target.value,
                                }))
                            }
                            type="text"
                            name="holder"
                            id="holder"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Foo Bar"
                            required />
                    </div>

                    <div className="w-full py-2">
                        <label htmlFor="cnumber" className="block mb-2 text-sm font-medium text-gray-900">Card Number</label>
                        <input
                            value={formValues.cardNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormValues((prevFormValues) => ({
                                    ...prevFormValues,
                                    cardNumber: e.target.value,
                                }))
                            }
                            type="number"
                            name="cnumber"
                            id="cnumber"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="00000111122223333"
                            required />
                    </div>
                </div>
                {error &&
                    <div className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 ring-1 ring-inset ring-red-500'>
                        <p className='text-sm text-gray-900'>
                            {error}
                        </p>
                    </div>
                }
                <div className="container px-10 mx-0 min-w-full flex flex-col items-center">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`text-white ${isFormValid ? 'bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' : 'bg-gray-400'} font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 `}
                    >
                        Purchase
                    </button>
                </div>
            </form>
        </>
    );

}