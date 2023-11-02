import { OrdersResponse, createOrder, getOrders } from "@/lib/handlers";
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
): Promise<NextResponse<OrdersResponse> | {}> {
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

  const orders = await getOrders(params.userId);

  if (orders === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(orders);
}

export async function POST(
    request: NextRequest,
    {
      params,
    }: {
      params: { userId: string };
    },
): Promise<NextResponse<OrdersResponse> | {} | 'empty'> {
  const session: Session | null =
  await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 }); // 401 Unauthorized
  }

  const body = await request.json();

  if (!Types.ObjectId.isValid(params.userId) || !body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json({}, { status: 400 });
  }

  const order = await createOrder(params.userId, body.address, body.cardHolder, body.cardNumber);

  if (order === 'empty') {
    return NextResponse.json({}, { status: 400 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 }); // 403 Forbidden
  }

  if (order === null) {
    return NextResponse.json({}, { status: 404 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${params.userId}/orders/${order._id}`);
  return NextResponse.json(order, { status: 201, headers: headers });
}