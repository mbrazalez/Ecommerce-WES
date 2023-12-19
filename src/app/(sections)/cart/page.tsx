import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import CartItemsList from '@/components/CartItemsList';


export const dynamic = 'force-dynamic';

export default async function Cart() {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    return (
        <div className='flex flex-col'>
            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                My Shopping Cart
            </h3>
            <CartItemsList /> 
        </div>
    );
}