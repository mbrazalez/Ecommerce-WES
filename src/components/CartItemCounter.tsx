/*'use client'

interface CartItemCounterProps {
    productId: string;
}

export default function CartItemCounter({
    productId
}: CartItemCounterProps) {
    const { data: session } = useSession({ required: true });
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const [isUpdating, setIsUpdating] = useState(false);

    const cartItem = cartItems.find((cartItem) =>
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
    <div className="relative inline-flex grow intems-center justify-center bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300">
        {qty}
    </div>

}*/
