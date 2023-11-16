import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';

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
            <div className="flex items-center sm:grid-cols-2">     
                <h4 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>{product.price}</h4>
            </div>
            <div className="flex items-center h-1">     
                <div className="inline-flex rounded-md shadow-sm " role="group " >
                    <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                        -
                    </button>
                    <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 dark:border-white dark:text-white dark:focus:bg-gray-700">
                        {qty}
                    </button>
                    <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                        +
                    </button>
                </div>
                <div className="inline-flex rounded-md shadow-sm ml-2 ">
                    <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-lg hover:bg-red-600 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>   
        </div>
    );
}
