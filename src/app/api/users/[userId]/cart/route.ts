import { CartItemsResponse, getCartItems } from "@/lib/handlers";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string };
    }
): Promise<NextResponse<CartItemsResponse> | {}> {
    const session: Session | null =
    await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({}, { status: 401 }); // 401 Unauthorized
    }

    if (!Types.ObjectId.isValid(params.userId)) {
        return NextResponse.json({}, { status: 400 });
    }

    if (session.user._id !== params.userId) {
        return NextResponse.json({}, { status: 403 }); // 403 Forbidden
    }

    const cartItems = await getCartItems(params.userId);

    if (cartItems === null) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(cartItems);
}