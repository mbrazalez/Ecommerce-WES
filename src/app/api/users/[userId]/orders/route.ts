import { Types } from 'mongoose';
import {NextRequest, NextResponse} from 'next/server';
import {getOrders, OrdersResponse} from '@/lib/handlers';
import {createOrder} from '@/lib/handlers';

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string };
    }
): Promise <NextResponse<OrdersResponse>| {}> {
    if (!Types.ObjectId.isValid(params.userId)) {
        return NextResponse.json({}, { status: 400 });
    }

    const user = await getOrders(params.userId);

    if (user === null) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function POST(
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string };
    }
): Promise <NextResponse<{_id: string;} | null>| {}> {
    const body = await request.json();

    if (!Types.ObjectId.isValid(params.userId) || !body.address || !body.cardHolder || !body.cardNumber) {
        return NextResponse.json({}, { status: 400 });
    }

    const user = await createOrder(params.userId, body.address, body.cardHolder, body.cardNumber);

    if (user === null) {
        return NextResponse.json({}, { status: 404 });
    }

    const headers = new Headers();
    headers.append('Location', `/api/users/${params.userId}/orders/${user._id}`);
    return NextResponse.json({ _id: user._id }, { status: 201, headers: headers });

}