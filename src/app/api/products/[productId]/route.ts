import { ProductResponse, getProduct } from "@/lib/handlers";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: { productId: string };
    }
): Promise<NextResponse<ProductResponse | {}>> {
    if (!Types.ObjectId.isValid(params.productId)) {
        return NextResponse.json({}, { status: 400 });
    }

    const product = await getProduct(params.productId);

    if (product === null) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(product);

}