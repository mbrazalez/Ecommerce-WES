import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { addProductToCart, CartItemsResponse } from '@/lib/handlers';
import { deleteProductFromCart } from '@/lib/handlers'; 

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

    const user = await addProductToCart(params.userId, params.productId, body.qty);

    if (user === null) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(user);
    // HAY QUE HACER LO DE 201
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