import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import CartItemCounter from '@/components/CartItemCounter';

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
                        {/*<div className="inline-flex rounded-md shadow-sm " role="group" >
                            <button type="button" className="inline-flex items-center px-4 py-1 text-gray-900 bg-gray-200 dark:bg-black border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button type="button" className="inline-flex items-center px-14 py-1 text-xl font-medium text-gray-900 bg-transparent dark:bg-gray-700 border-t border-b border-gray-900 dark:border-white dark:text-white dark:focus:bg-gray-700">
                                0
                            </button>
                            <button type="button" className="inline-flex items-center px-4 py-1 text-gray-900 bg-gray-200 dark:bg-black border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                            </button>
                        </div>*/}
                        <CartItemCounter productId={product._id.toString()} />
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
