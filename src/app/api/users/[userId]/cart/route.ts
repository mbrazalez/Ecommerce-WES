import { Types } from 'mongoose';
import {NextRequest, NextResponse} from 'next/server';
import {getCartItems, CartItemsResponse} from '@/lib/handlers';

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string };
    }
): Promise <NextResponse<CartItemsResponse> | {}> {
    if (!Types.ObjectId.isValid(params.userId)) {
        return NextResponse.json({}, { status: 400 });
    }

    const user = await getCartItems(params.userId);

    if (user == null) {
        return NextResponse.json({}, { status: 404 });
    }
    
    return NextResponse.json(user);
}