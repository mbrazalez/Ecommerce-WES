import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartItemsResponse, getCartItems } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Checkout() {
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
                        Checkout
                    </h3>
                    <div className="relative overflow-x-auto ">
                        <div className="relative overflow-x-auto rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 md:pr-72 lg:pr-80 xl:pr-96 py-3">
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
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white" >
                                                <Link href={`/products/${cartItem.product._id}`}>
                                                    {cartItem.product.name}
                                                </Link>
                                            </th>
                                            <td className="px-12 py-4">
                                                {cartItem.qty}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
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
                        
                    </div>
                    <div className="grid sm:gap-6 py-10 mx-0 min-w-full flex flex-col sm:grid-cols-2">
                        <div className="sm:col-span-2 py-2">
                            <label htmlFor="saddress" className="block mb-2 text-sm font-medium text-gray-900">Shipping address</label>
                            <input type="text" name="saddress" id="saddress" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="221b Baker, St, London, UK"/>
                        </div>
                        <div className="w-full">
                            <label htmlFor="holder" className="block mb-2 text-sm font-medium text-gray-900">Card Holder</label>
                            <input type="text" name="holder" id="holder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Foo Bar"/>
                        </div>

                        <div className="w-full">
                            <label htmlFor="cnumber" className="block mb-2 text-sm font-medium text-gray-900">Card Number</label>
                            <input type="number" name="cnumber" id="cnumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="00000111122223333" />
                        </div>
                    </div>
                    <div className="container px-10 mx-0 min-w-full flex flex-col items-center">
                        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            <Link href="#">
                                Purchase
                            </Link>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}