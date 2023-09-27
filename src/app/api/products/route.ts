//  Se tiene que llamar route.ts si o si
import { ProductsResponse, getProducts} from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<ProductsResponse>> {
    const products = await getProducts();

    return NextResponse.json(products);
}
