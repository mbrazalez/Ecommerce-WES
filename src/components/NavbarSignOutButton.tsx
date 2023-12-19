'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export const navbarButtonClasses =
    'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white ';

interface SignOutButtonProps {
    children: ReactNode;
}

export default function NavbarSignOutButton({children }: SignOutButtonProps) {
    const router = useRouter();
    const handleSubmit = async function (
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            return false;
        }

        const res = await fetch(`/api/auth/signout`, {
            method: 'POST',
        });

        if (res.ok) {
            router.push('/auth/signin');
            router.refresh();
        }
    };
    
    return (
        <button className={navbarButtonClasses} onClick={handleSubmit}>
            {children}
        </button>
    );
}