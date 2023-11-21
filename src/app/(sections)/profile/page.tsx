import { Types } from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { getUser } from '@/lib/handlers';
import { getOrders, OrdersResponse } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Profile() {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const user = await getUser(session.user._id);

    if (user === null) {
        notFound();
    }

    const formattedDate = user.birthdate
        ? new Date(user.birthdate).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '';

    const data: OrdersResponse | null = await getOrders(session.user._id);

    if (!data) {
        notFound();
    }

    return (


        <div className='flex flex-col'>
            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                User Profile
            </h3>
            <div className='flex flex-col'>
                        <div>
                            {user.name && user.surname &&
                            <div className="flex py-2">
                                <p className='truncate'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline-block">
                                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                    </svg>

                                    <span className="font-bold ml-3 mr-3">Full name:</span> {user.name} {user.surname}
                                </p>
                            </div>
                            }
                        
                            {user.email &&
                            <div className="flex py-2">
                                <p className='truncate'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline-block">
                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                    </svg>

                                    <span className="font-bold ml-3 mr-3">E-mail address:</span> {user.email}
                                </p>
                            </div>
                            }

                            {user.address &&
                            <div className="flex py-2">
                                <p className='truncate'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline-block">
                                        <path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zm3-11a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM7.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM11 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" clipRule="evenodd" />
                                    </svg>

                                    <span className="font-bold ml-3 mr-3">Address:</span> {user.address}
                                </p>
                            </div>
                            }

                            {user.birthdate &&
                            <div className="flex py-2">
                                <p className="truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline-block">
                                        <path d="M6.75.98l-.884.883a1.25 1.25 0 101.768 0L6.75.98zM13.25.98l-.884.883a1.25 1.25 0 101.768 0L13.25.98zM10 .98l.884.883a1.25 1.25 0 11-1.768 0L10 .98zM7.5 5.75a.75.75 0 00-1.5 0v.464c-1.179.305-2 1.39-2 2.622v.094c.1-.02.202-.038.306-.051A42.869 42.869 0 0110 8.5c1.93 0 3.83.129 5.694.379.104.013.206.03.306.051v-.094c0-1.232-.821-2.317-2-2.622V5.75a.75.75 0 00-1.5 0v.318a45.645 45.645 0 00-1.75-.062V5.75a.75.75 0 00-1.5 0v.256c-.586.01-1.17.03-1.75.062V5.75zM4.505 10.365A41.377 41.377 0 0110 10c1.863 0 3.697.124 5.495.365C16.967 10.562 18 11.838 18 13.28v.693a3.72 3.72 0 01-1.665-.393 5.222 5.222 0 00-4.67 0 3.722 3.722 0 01-3.33 0 5.222 5.222 0 00-4.67 0A3.72 3.72 0 012 13.972v-.693c0-1.441 1.033-2.716 2.505-2.914zM15.665 14.921a5.22 5.22 0 002.335.551V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-1.028c.8 0 1.6-.183 2.335-.551a3.722 3.722 0 013.33 0c1.47.735 3.2.735 4.67 0a3.722 3.722 0 013.33 0z" />
                                    </svg>

                                    <span className="font-bold ml-3 mr-3">Birthdate:</span> {formattedDate}
                                </p>
                            </div>
                            }
                        </div>
                    </div>
            {data.orders.length === 0 ? (
                <div className='text-center py-10'>
                    <span className='text-sm text-gray-400'>You have not placed any order yet</span>
                </div>
            ) : (
                <>   
                    <div className="py-6 relative overflow-x-auto">
                        <div className="relative overflow-x-auto rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Order id
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden sm:table-cell md:table-cell">
                                            Shipment address
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden sm:table-cell md:table-cell">
                                            Payment information
                                        </th>
                                        <th scope="col" className="px-6 py-3">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.orders.map((order: any, index: number) => (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={order._id.toString()}> 
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {order._id.toString()}
                                            </th>
                                            <td className="px-6 py-4 hidden sm:table-cell md:table-cell">
                                                {order.address}
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell md:table-cell">
                                                <p>
                                                    {order.cardHolder}
                                                </p>
                                                <p className="text-gray-400 dark:text-gray-500">
                                                    {order.cardNumber}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/orders/${order._id}`}>
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}