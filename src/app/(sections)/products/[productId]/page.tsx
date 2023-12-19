import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import CartItemCounterWrapper from '@/components/CartItemCounterWrapper';

export default async function Product({
    params,
}: {
    params: { productId: string };
}) {
    let qty = 0;
    
    if (!Types.ObjectId.isValid(params.productId)) {
        notFound();
    }

    const product = await getProduct(params.productId);

    const session: Session | null = await getServerSession(authOptions);

    if (product === null) {
        notFound();
    }

    return (
        <div className="flex-auto">
            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                {product.name}
            </h3>
            <div className="grid py-4 min-w-full flex flex-col sm:grid-cols-2">
                <div className='w-full'>
                    <div className='flex justify-center py-2'>
                        <img
                            src={product.img}
                            alt={product.name}
                            className='h-1/2 w-1/2'
                        />
                    </div>
                    <p className="flex justify-center text-4xl text-gray-900 py-2">{product.price} €</p>
                    {session && (
                    <div className="flex justify-center">  
                        <CartItemCounterWrapper 
                            productId={params.productId}
                        />
                    </div>
                    )}    
                </div>
                <div className='w-full py-10 sm:py-0 md:py-0 lg:py-0 xl:py-0'>
                    <p className="text-2xl font-bold pb-3">Product Details</p>
                    {product.description && <p><span className="font-bold"></span> {product.description}</p>}
                    <div className="py-3">
                        {product.brand && <p><span className="font-bold">Brand:</span> {product.brand}</p>}
                        {product.size && <p><span className="font-bold">Size:</span> {product.size}</p>}
                    </div>
                </div>
            </div>
        </div>    
    );
}
