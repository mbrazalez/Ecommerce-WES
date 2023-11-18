import { Types } from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { getOrder } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Order({
    params,
}: {
    params: { userId: string, orderId: string };

}) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    if (!Types.ObjectId.isValid(params.orderId) || !Types.ObjectId.isValid(session.user._id)) {
        notFound();
    }

    const order = await getOrder(session.user._id, params.orderId);

    if (order === null) {
        notFound();
    }

    const formattedDate = order.date
        ? new Date(order.date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        })
        : '';

    return (
        <div className='flex flex-col'>
            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                Order Details
            </h3>
            <div className='flex'>
                <div>
                    {order._id && 
                        <p className='flex py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            <span className="font-bold ml-3 mr-3">Order ID:</span> {order._id.toString()}
                        </p>
                    }
                
                    {order.address &&
                        <p className='flex py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zm3-11a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM7.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM11 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" clipRule="evenodd" />
                            </svg>

                            <span className="font-bold ml-3 mr-3">Shipping address:</span> {order.address}
                        </p>
                    }

                    {order.cardNumber && order.cardHolder &&
                        <p className='flex py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
                            </svg>

                            <span className="font-bold ml-3 mr-3">Payment information:</span> {order.cardNumber} ({order.cardHolder})
                        </p>}
                    {order.date &&
                        <p className='flex py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                            </svg>

                            <span className="font-bold ml-3 mr-3">Date of purchase:</span> {formattedDate}
                        </p>
                    }
                </div>
            </div>
            
            <div className="py-6 relative overflow-x-auto">
                <div className="relative overflow-x-auto rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((product: any, index: number) => (
                                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={product.product._id.toString()}> 
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Link href={`/products/${product.product._id}`}>
                                            {product.product.name}
                                        </Link>
                                    </th>
                                    <td className="px-12 py-4">
                                        {product.qty}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.price + ' €'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(product.qty * product.price).toFixed(2) + ' €'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Total:</td>
                                <td colSpan={2}></td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" colSpan={4}>
                                    {order.orderItems.map((product:any) => (product.price*product.qty)).reduce((a:number, b:number) => a + b, 0).toFixed(2)+ ' €'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}