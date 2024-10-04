import Image from 'next/image'
import Link from 'next/link'
export default function Landinpage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center font-serif ">
      <Image
        src="/smartdrainage.jpg"
        alt="Tunnel background"
        fill
        className="object-cover"
      />
      <div className='absolute inset-0 bg-black opacity-60'></div>
      <div className="relative z-10 text-center p-8  bg-opacity-60 rounded-lg">
        <h1 className="text-xl md:text-7xl font-bold text-white mb-12 space-x-4 mt-6 ">
          Transform your property<br />with<span className="text-[#008FFF]">smartdrain!</span>
        </h1>
        <Link href='./sign-up'>
        <button className="mt-6 px-8 py-4 bg-blue-500 text-white text-lg font-bold rounded-md hover:bg-blue-600 transition duration-300">
          Get Started
        </button>
        </Link>
      </div>
    </main>
  )
}
