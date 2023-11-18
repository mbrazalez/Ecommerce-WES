import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartItemsResponse, getCartItems } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Cart() {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const data: CartItemsResponse | null = await getCartItems(session.user._id);

    if (!data) {
        notFound();
    }
    return (
        <div className='flex flex-col'>
            {data.cartItems.length === 0 ? (
                <div className='text-center'>
                    <span className='text-sm text-gray-400'>The cart is empty</span>
                </div>
            ) : (
                <>
                    <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                        My Shopping Cart
                    </h3>
                    <div className="relative overflow-x-auto">
                        <div className="relative overflow-x-auto rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Product Name                     
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
                                    {data.cartItems.map((cartItem:any, index:number) => (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" 
                                                key={cartItem.product._id.toString()}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                                <Link href={`/products/${cartItem.product._id}`}>
                                                    {cartItem.product.name}
                                                </Link>
                                            </th>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">                         
                                                    <div className="inline-flex rounded-md shadow-sm " role="group " >
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                                            -
                                                        </button>
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 dark:border-white dark:text-white dark:focus:bg-gray-700">
                                                            {cartItem.qty}
                                                        </button>
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="inline-flex rounded-md shadow-sm ml-2 ">
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-lg hover:bg-red-600 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>   
                                            </td>
                                            <td className="px-6 py-4">
                                                {cartItem.product.price+ ' €'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {(cartItem.product.price*cartItem.qty).toFixed(2)+ ' €'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Total:</td>
                                        <td colSpan={2}></td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" colSpan={4}>
                                            {data.cartItems.map((cartItem:any) => (cartItem.product.price*cartItem.qty)).reduce((a:number, b:number) => a + b, 0).toFixed(2)+ ' €'}
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
                        </div>
                        <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                <Link href={`/checkout`}>
                                    Checkout
                                </Link>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}