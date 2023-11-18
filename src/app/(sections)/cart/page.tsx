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
                                                    <div className="inline-flex rounded-md shadow-sm " role="group" >
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 dark:bg-gray-400 border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                                            -
                                                        </button>
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 dark:border-white dark:text-white dark:focus:bg-gray-700">
                                                            {cartItem.qty}
                                                        </button>
                                                        <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 dark:bg-gray-400 border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="inline-flex rounded-md shadow-sm ml-2 ">
                                                        <button type="button" className="inline-flex items-center px-2 py-2 text-gray-900 bg-gray-200 dark:bg-gray-400 border border-gray-900 rounded-lg hover:bg-red-600 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
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