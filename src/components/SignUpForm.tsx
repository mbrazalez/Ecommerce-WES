'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/handlers';

interface FormValues {
    email: string;
    name: string;
    surname: string;
    password: string;
    address: string;
    birthdate: string;
}

export default function SignUpForm() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [formValues, setFormValues] = useState<FormValues>({
        email: '',
        name: '',
        surname: '',
        password: '',
        address: '',
        birthdate: '',
    });

    const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            return false;
        }

        try {
            const res = await fetch(`/api/users`,
                {
                    method: 'POST',
                    body: JSON.stringify(formValues),
                });

            if (res.ok) {
                const body = await res.json();
                createUser(body.formValues);
            }
        }
        finally {
            setError('');
            router.push('/');
            router.refresh();
        }
    };

    return (
        <form className='group space-y-6' onSubmit={handleSubmit} noValidate>
            <div>
                <label
                    htmlFor='email'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    E-mail address
                </label>
                <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    placeholder='johndoe@example.com'
                    required
                    className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
                    value={formValues.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            email: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid email address.
                </p>
            </div>

            <div>
                <label
                    htmlFor='name'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Name
                </label>
                <input
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='name'
                    placeholder='John Doe'
                    required
                    className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
                    value={formValues.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            name: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid email address.
                </p>
            </div>

            <div>
                <label
                    htmlFor='password'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Password
                </label>
                <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    placeholder=' '
                    required
                    className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
                    value={formValues.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            password: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please input your password.
                </p>
            </div>

            <div>
                <label
                    htmlFor='address'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Address
                </label>
                <input
                    id='address'
                    name='address'
                    type='text'
                    autoComplete='address'
                    placeholder='John Doe'
                    required
                    className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
                    value={formValues.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            address: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid email address.
                </p>
            </div>

            <div>
                <label
                    htmlFor='birthdate'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Birthdate
                </label>
                <input
                    id='birthdate'
                    name='birthdate'
                    type='date'
                    autoComplete='birthdate'
                    placeholder='John Doe'
                    required
                    className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
                    value={formValues.birthdate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            birthdate: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid email address.
                </p>
            </div>


            {error &&
                <div className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 ring-1 ring-inset ring-red-500'>
                    <p className='text-sm text-gray-900'>
                        {error}
                    </p>
                </div>
            }

            <div>
                <button
                    type='submit'
                    className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30'
                >
                    Sign up
                </button>
            </div>
        </form>
    );
}