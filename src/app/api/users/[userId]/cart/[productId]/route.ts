import { CartItemsResponse, updateCartItem, deleteCartItem } from "@/lib/handlers";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function PUT (
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string, productId: string };
    }
): Promise<NextResponse<CartItemsResponse | {}>> {

    const session: Session | null =
    await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({}, { status: 401 }); // 401 Unauthorized
    }

    const body = await request.json();
    
    if (body.qty<1 || !body.qty || !Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId)) {
        return NextResponse.json({}, { status: 400 });
    }

    if (session.user._id !== params.userId) {
        return NextResponse.json({}, { status: 403 }); // 403 Forbidden
    }

    const cartItems = await updateCartItem(params.userId, params.productId, body.qty);

    if (cartItems?.cartItems === null || cartItems === null) {
        return NextResponse.json({}, { status: 404 });
    }

    if (cartItems?.exists) {
        return NextResponse.json({cartItems: cartItems.cartItems});
    }

    return NextResponse.json({cartItems:cartItems?.cartItems}, { status: 201 });

}

export async function DELETE (
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string, productId: string };
    }
): Promise<NextResponse<CartItemsResponse | {}>> {
    const session: Session | null =
    await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({}, { status: 401 }); // 401 Unauthorized
    }

    if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId)) {
        return NextResponse.json({}, { status: 400 });
    }

    if (session.user._id !== params.userId) {
        return NextResponse.json({}, { status: 403 }); // 403 Forbidden
    }
    
    const cartItems = await deleteCartItem(params.userId, params.productId);

    if (cartItems === null) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(cartItems);
}
