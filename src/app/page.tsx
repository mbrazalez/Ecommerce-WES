export default function Index() {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex min-h-full flex-1 flex-col justify-center text-center'>
        <h1 className='text-4xl	font-bold'>Hello world!</h1>
        <p className='font-light'>This is the welcome page of your project</p>
        <p className='font-bold'><a href = "./api/products">Products</a></p>
      </div>
    </div>
  );
}
