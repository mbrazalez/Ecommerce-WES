import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';

export default async function Product({
    params,
}: {
    params: { productId: string };
}) {
    if (!Types.ObjectId.isValid(params.productId)) {
        notFound();
    }

    const product = await getProduct(params.productId);

    if (product === null) {
        notFound();
    }

    return (
        <div className='flex flex-col'>
            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                {product.name}
            </h3>
            <div className='flex'>
                <img
                    src={product.img}
                    alt={product.name}
                    className='h-40 w-40 object-cover object-center group-hover:opacity-75'
                />
                <div className='ml-4'>
                    {product.brand && <p><span className="font-bold">Brand:</span> {product.brand}</p>}
                    {product.price && <p><span className="font-bold">Price:</span> {product.price}€</p>}
                    {product.color && <p><span className="font-bold">Color:</span> {product.color}</p>}
                    {product.size && <p><span className="font-bold">Size:</span> {product.size}</p>}
                </div>
            </div>
        </div>
    );
}
// ml-4: margin-left: 1rem