import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { addProductToCart, CartItemsResponse } from '@/lib/handlers';
import { deleteProductFromCart } from '@/lib/handlers'; 
import { getCartItems } from '@/lib/handlers';

export async function PUT(
    request: NextRequest,
    {
        params,
    }:{
        params: { userId: string, productId: string };
    }
): Promise <NextResponse<CartItemsResponse> | {}> {
    const body = await request.json();

    if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId) || !body.qty || body.qty < 1 ) {
        return NextResponse.json({}, { status: 400 });
    }

    const prevuser = await getCartItems(params.userId);
    const user = await addProductToCart(params.userId, params.productId, body.qty);

    if (user === null || prevuser === null) {
        return NextResponse.json({}, { status: 404 });
    }

    // Verifica si se creó una nueva entrada en el carrito. Si se creó, devuelve 201
    const result = user.cartItems.length - prevuser.cartItems.length;

    if (result === 1) {
        return NextResponse.json(user, { status: 201 });
    }

    return NextResponse.json(user);
}

export async function DELETE(
    request: NextRequest,
    {
        params,
    }:{
        params: { userId: string, productId: string };
    }
): Promise <NextResponse<CartItemsResponse> | {}> {
    if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId)) {
        return NextResponse.json({}, { status: 400 });
    }

    const user = await deleteProductFromCart(params.userId, params.productId);

    if (user === null) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(user);
}