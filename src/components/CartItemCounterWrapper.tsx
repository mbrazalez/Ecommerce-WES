'use client'

import React, { useEffect, useContext } from 'react';
import { CartItemsContext } from '@/providers/CartItemsProvider';
import CartItemCounter from '@/components/CartItemCounter';
import { useSession } from 'next-auth/react';

const CartItemCounterWrapper = ({ productId }: { productId: string }) => {
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            const fetchCart = async () => {
                try {
                    const response = await fetch(`/api/users/${session.user._id}/cart`);
                    if (response.ok) {
                        const body = await response.json();
                        updateCartItems(body.cartItems);
                    } else {
                        console.error('Error fetching cart:', response);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            };

            fetchCart();
        } else {
            updateCartItems([]);
        }

    }, [updateCartItems, session]);

    return <CartItemCounter productId={productId} />;
};

export default CartItemCounterWrapper;
