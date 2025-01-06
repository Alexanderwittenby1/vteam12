import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const navigation = [,
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">

          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center no-underline">
              <Image
                src="/gogo.png"
                alt="GOGO Logo"
                width={100}
                height={40}
                priority
              />
            </Link>
          </div>

          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-[#8B3A89] px-3 py-2 text-sm font-medium no-underline hover:no-underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <Link
              href="/login"
              className="rounded-full bg-[#8B3A89] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#9F4A9D] transition-colors no-underline hover:no-underline"
            >
              Login
            </Link>
          </div>

          <div className="sm:hidden ml-auto">
            <label htmlFor="nav-toggle" className="cursor-pointer">
              <div className="space-y-2">
                <span className="block w-8 h-0.5 bg-gray-600"></span>
                <span className="block w-8 h-0.5 bg-gray-600"></span>
                <span className="block w-8 h-0.5 bg-gray-600"></span>
              </div>
            </label>
            <input 
              type="checkbox" 
              id="nav-toggle" 
              className="hidden peer"
            />
            
            <div className="hidden peer-checked:block fixed inset-0 bg-black/50 z-40"></div>

            <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 transform translate-x-full transition-transform duration-300 peer-checked:translate-x-0 shadow-xl">
              <div className="pt-20 px-4">
                <label 
                  htmlFor="nav-toggle" 
                  className="absolute top-6 right-4 cursor-pointer"
                >
                  <div className="relative w-8 h-8">
                    <span className="absolute top-1/2 left-0 w-8 h-0.5 bg-gray-600 rotate-45"></span>
                    <span className="absolute top-1/2 left-0 w-8 h-0.5 bg-gray-600 -rotate-45"></span>
                  </div>
                </label>
                
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-[#8B3A89] px-3 py-2 text-lg font-medium border-b border-gray-100 no-underline hover:no-underline"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4">
                    <Link
                      href="/login"
                      className="w-full rounded-full bg-[#8B3A89] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#9F4A9D] transition-colors text-center block no-underline hover:no-underline"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}