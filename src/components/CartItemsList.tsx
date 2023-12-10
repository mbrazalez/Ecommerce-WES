'use client'

import { useContext } from 'react'
import { CartItemsContext } from '@/providers/CartItemsProvider'
import CartItemCounter from '@/components/CartItemCounter';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CartItemsList() {
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const { data: session } = useSession();
    
    useEffect(() => {
        if (session) {
          const fetchData = async function () {
            const res = await fetch(`/api/users/${session.user._id}/cart`);
            const body = await res.json();
            updateCartItems(body.cartItems);
          };
    
          fetchData().catch(console.error);
        } else {
            updateCartItems([]);
        }
      }, [updateCartItems, session]);
    
    

    return (
        <>
        {cartItems.length === 0 ? (
            <div className='text-center'>
                <span className='text-sm text-gray-400'>The cart is empty</span>
            </div>
        ) : (
            <>
                <div className="relative overflow-x-auto">
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
                                {cartItems.map((cartItem:any, index:number) => (
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" 
                                            key={cartItem.product._id.toString()}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white" >
                                            <Link href={`/products/${cartItem.product._id}`}>
                                                {cartItem.product.name}
                                            </Link>
                                        </th>
                                        <td className="px-6 py-4">
                                            <CartItemCounter 
                                                productId={cartItem.product._id.toString()}
                                            />
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
                                        {cartItems.map((cartItem:any) => (cartItem.product.price*cartItem.qty)).reduce((a:number, b:number) => a + b, 0).toFixed(2)+ ' €'}
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
        </>
    )
}