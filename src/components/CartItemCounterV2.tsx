'use client'

import { CartItemsContext,CartItem } from '@/providers/CartItemsProvider'
import { useSession } from 'next-auth/react'
import { useState, useContext } from 'react'

interface CartItemCounterProps {
    productId: string;
    cartList: CartItem[]; 
}

export default function CartItemCounterV({
    productId,
    cartList,

}: CartItemCounterProps) {

    const { data: session } = useSession({ required: true });
    const { cartItems,  updateCartItems } = useContext(CartItemsContext);
    const [isUpdating, setIsUpdating] = useState(false);

    const cartItem = cartList.find((cartItem) =>
        cartItem.product._id === productId
    );

    const qty = cartItem ? cartItem.qty : 0;

    const onPlusBtnClick = async function (event: React.MouseEvent) {
        setIsUpdating(true);

        try {
            const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        qty: qty + 1,
                    }),
                }
            );

            if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
            }
        } finally {
            setIsUpdating(false);
        }
    };

 const onMinusBtnClick = async function (event: React.MouseEvent) {
        setIsUpdating(true);
        let choosenMethod = 'PUT';
        let bodyContent : string  = JSON.stringify({
            qty: qty - 1,
        });

        if (qty === 1) {
            choosenMethod = 'DELETE';
            bodyContent = '';
        }

        try{
            const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                    method: choosenMethod,
                    body: bodyContent
                }
            );

            if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
            }
            
        }finally{
            setIsUpdating(false);
        }   
    };

    const onRemoveBtnClick = async function (event: React.MouseEvent) {
        setIsUpdating(true);

        try {
            const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                    method: 'DELETE',
                }
            );

            if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
            }
        } finally {
            setIsUpdating(false);
        }
    }
    return (
        <>
            <div className="flex items-center">
                <>
            <div className="flex items-center">                         
                <div className="inline-flex rounded-md shadow-sm " role="group" >
                    <button onClick={onMinusBtnClick} type="button" className="inline-flex items-center px-3 py-2 text-gray-900 bg-gray-200 dark:bg-black border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-900" disabled={!session || isUpdating}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button type="button" className="inline-flex items-center px-5 py-2 text-gray-900 bg-transparent dark:bg-gray-700 border-t border-b border-gray-900 dark:border-white dark:text-white">
                        {qty}
                    </button>
                    <button  onClick={onPlusBtnClick} type="button" className="inline-flex items-center px-3 py-2 text-gray-900 bg-gray-200 dark:bg-black border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-900" disabled={!session || isUpdating}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                    </button>
                </div>
                <div className="inline-flex rounded-md shadow-sm ml-2" >
                    <button onClick={onRemoveBtnClick} disabled={!session || isUpdating} type="button" className="inline-flex items-center px-2 py-2 text-gray-900 bg-red-200 dark:bg-red-400 border border-gray-900 rounded-lg hover:bg-red-600 hover:text-white dark:border-white dark:text-white dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
            </div>
        </>
    );
}