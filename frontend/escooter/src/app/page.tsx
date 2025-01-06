import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";


const HomePage = () => {
  const newsItems = [
    {
      image: "/globe.svg",
      title: "Sustainable Urban Transit Summit 2024",
      description: "Join us for the future of urban mobility",
    },
    {
      image: "/window.svg",
      title: "New Parking Zones Added",
      description: "Expanding our service areas",
    },
    {
      image: "/file.svg",
      title: "Safety First: Our Commitment",
      description: "Learn about our safety initiatives",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/karlskrona.png"
            alt="Karlskrona city view"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white max-w-2xl">
            <h1 className="text-6xl font-bold mb-6">
              Smart mobility for a smarter city
            </h1>
            <p className="text-xl mb-8">
              Discover the freedom of sustainable transportation in your city
            </p>
            <button className="bg-[#8B3A89] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#9F4A9D] transition">
              Start riding today
            </button>
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="relative">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/karlskrona.jpeg"
                  alt="Person riding scooter"
                  fill
                  className="rounded-lg shadow-xl object-cover"
                />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Easy way to move around
                </h3>
                <p className="text-gray-600">
                  Unlock a scooter and experience the freedom of effortless
                  urban mobility. Perfect for both daily commutes and leisure
                  rides.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/karlskrona.jpeg"
                  alt="City view"
                  fill
                  className="rounded-lg shadow-xl object-cover"
                />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Available everywhere
                </h3>
                <p className="text-gray-600">
                  Find our scooters throughout the city. Park in designated
                  zones for a smoother experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Together for a better tomorrow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🛴</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Accessible mobility
              </h3>
              <p className="text-gray-600">Easy-to-use scooters for everyone</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Eco-friendly transport
              </h3>
              <p className="text-gray-600">Zero emissions for a cleaner city</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🏙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Smart city integration
              </h3>
              <p className="text-gray-600">
                Seamlessly connected urban mobility
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12">Latest news</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="mt-6 text-xl font-semibold group-hover:text-[#8B3A89] transition">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
          <button className="bg-[#8B3A89] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#9F4A9D] transition">
            Book your first ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
