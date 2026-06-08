'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause()
  }

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.play()
  }
  return (
    <main className="min-h-screen bg-[#fdf6ee]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#fdf6ee] shadow-sm">
        <div>
          <p className="text-2xl font-black text-[#5c3d1e]">Heritage Kennels</p>
          <p className="text-xs text-[#a07850]">The Farmer's Dog</p>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/puppies" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Available Puppies</Link>
          <Link href="/about" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">About Us</Link>
          <Link href="/contact" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Contact</Link>
          <Link href="/puppies" className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold hover:bg-[#a07850] transition-colors">
            Find Your Puppy
          </Link>
        </div>
      </nav>

      {/* Hero Section - Video Background */}
      <section
        className="relative h-[90vh] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
            Raised with Love, Born for Family
          </h1>
          <p className="text-xl text-white/90 mb-2 font-semibold">
            Trusted breeders of Labradors, Poodles & German Shepherds
          </p>
          <p className="text-white/75 mb-10">Dallas, Texas — Nationwide Delivery Available</p>
          <div className="flex gap-4">
            <Link href="/puppies" className="bg-[#5c3d1e] text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-[#a07850] transition-colors">
              Browse Available Puppies
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-[#5c3d1e] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Breeds Section */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-4xl font-black text-[#5c3d1e] mb-3">Our Breeds</h2>
        <p className="text-[#a07850] mb-12 text-lg">Hand raised on our farm in Dallas, Texas</p>
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { breed: 'Labrador Retriever', image: '/labrador.jpg' },
            { breed: 'Poodle', image: '/poodle.jpg' },
            { breed: 'German Shepherd', image: '/german-shepherd.jpg' },
          ].map((item) => (
            <Link href={`/puppies?breed=${item.breed}`} key={item.breed}
              className="bg-white border-2 border-[#e8d5b7] rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#a07850] transition-all cursor-pointer">
              <div className="h-48 overflow-hidden">
                <Image src={item.image} alt={item.breed} width={400} height={200} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-[#5c3d1e]">{item.breed}</h3>
                <p className="text-[#a07850] text-sm mt-2">View available puppies →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#5c3d1e] text-white px-8 py-20 text-center">
        <h2 className="text-4xl font-black mb-12">Why Heritage Kennels?</h2>
        <div className="grid grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { icon: '❤️', title: 'Raised with Love', desc: 'Every puppy is hand raised on our family farm' },
            { icon: '🏥', title: 'Health Checked', desc: 'Vet certified with full vaccination records' },
            { icon: '🚚', title: 'Nationwide Delivery', desc: 'Safe delivery across all 50 states' },
            { icon: '📞', title: 'Lifetime Support', desc: 'We are always here for you and your pup' },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-black text-lg mb-2">{item.title}</h3>
              <p className="text-[#e8d5b7] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 text-center bg-[#fdf6ee]">
        <h2 className="text-4xl font-black text-[#5c3d1e] mb-12">How It Works</h2>
        <div className="grid grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Browse Puppies', desc: 'Explore our available puppies by breed' },
            { step: '2', title: 'Pick Your Pup', desc: 'Find the perfect puppy for your family' },
            { step: '3', title: 'Contact Us', desc: 'Reach out via Facebook or Instagram' },
            { step: '4', title: 'Welcome Home', desc: 'Local pickup or nationwide delivery' },
          ].map((item) => (
            <div key={item.step}>
              <div className="w-14 h-14 bg-[#5c3d1e] text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-black text-lg text-[#5c3d1e] mb-2">{item.title}</h3>
              <p className="text-[#a07850] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white px-8 py-20 text-center">
        <h2 className="text-4xl font-black text-[#5c3d1e] mb-12">Happy Puppy Parents</h2>
        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Sarah M.', location: 'Austin, TX', review: 'Our Labrador Max is the most loving dog. Heritage Kennels made the whole process so easy and stress free!', stars: 5 },
            { name: 'James K.', location: 'New York, NY', review: 'The German Shepherd we got is incredible. Delivered safely all the way to New York. Highly recommend!', stars: 5 },
            { name: 'Linda T.', location: 'Los Angeles, CA', review: 'Our Poodle is so healthy and well raised. You can tell these puppies are raised with real love and care.', stars: 5 },
          ].map((review) => (
            <div key={review.name} className="bg-[#fdf6ee] rounded-3xl p-8 text-left border-2 border-[#e8d5b7]">
              <div className="text-yellow-400 text-xl mb-3">{'⭐'.repeat(review.stars)}</div>
              <p className="text-[#5c3d1e] mb-4 italic">"{review.review}"</p>
              <p className="font-black text-[#5c3d1e]">{review.name}</p>
              <p className="text-[#a07850] text-sm">{review.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#e8d5b7] px-8 py-20 text-center">
        <h2 className="text-4xl font-black text-[#5c3d1e] mb-4">Ready to Find Your Perfect Pup?</h2>
        <p className="text-[#a07850] text-lg mb-8">Browse our available puppies or reach out to us directly</p>
        <div className="flex justify-center gap-4">
          <Link href="/puppies" className="bg-[#5c3d1e] text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-[#a07850] transition-colors">
            Browse Puppies
          </Link>
          <Link href="/contact" className="border-2 border-[#5c3d1e] text-[#5c3d1e] px-8 py-3 rounded-full text-lg font-bold hover:bg-[#5c3d1e] hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3a2410] text-white px-8 py-10 text-center">
        <p className="text-3xl font-black mb-1">Heritage Kennels</p>
        <p className="text-[#a07850] text-sm mb-6">The Farmer's Dog — Dallas, Texas</p>
        <div className="flex justify-center gap-8 text-sm text-[#e8d5b7] mb-6">
          <Link href="/puppies" className="hover:text-white">Available Puppies</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
        <p className="text-[#a07850] text-xs">© 2026 Heritage Kennels. All rights reserved.</p>
      </footer>
    </main>
  )
}