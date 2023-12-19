import SignUpForm from '@/components/SignUpForm';

export default function SignUp() {
    return (
        <div className='flex w-full flex-col px-6 py-12'>
            <div className='mx-auto w-full max-w-sm'>
                <img
                    className='mx-auto h-10 w-auto'
                    src='https://images.vexels.com/media/users/3/132153/isolated/preview/2b07e0f940d92cdf0b02e0256417d93b-icono-de-circulo-de-patinaje.png'
                    alt='ChanchiSkates logo'
                />
                <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                    Sign up in Chanchi skateboards
                </h2>
            </div>

            <div className='mx-auto mt-10 w-full max-w-sm'>
                <SignUpForm />
            </div>
        </div>
    );
}