import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartItemsResponse, getCartItems } from '@/lib/handlers';
import CheckoutForm from '@/components/CheckoutForm';
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
                <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                        Checkout
                </h3>
            {data.cartItems.length === 0 ? (
                <div className='text-center'>
                    <span className='text-sm text-gray-400'>The cart is empty</span>
                </div>
            ) : (
                <>

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
                    <CheckoutForm/>
                </>
            )}
        </div>
    );
}