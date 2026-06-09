'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'
import FeaturedPuppies from '@/components/puppies/FeaturedPuppies'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause()
  }

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.play()
  }

  return (
    <main className="min-h-screen bg-[#fdf6ee]">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-5 md:px-8 py-4 bg-[#fdf6ee] shadow-sm sticky top-0 z-40">
        <div>
          <p className="text-xl md:text-2xl font-black text-[#5c3d1e]">Heritage Kennels</p>
          <p className="text-xs text-[#a07850]">The Farmer's Dog</p>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/puppies" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Available Puppies</Link>
          <Link href="/about" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">About Us</Link>
          <Link href="/contact" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Contact</Link>
          <Link href="/puppies" className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold hover:bg-[#a07850] transition-colors">
            Find Your Puppy
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#5c3d1e] text-2xl font-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#e8d5b7] px-5 py-4 flex flex-col gap-4 z-30">
          <Link href="/puppies" onClick={() => setMenuOpen(false)} className="text-[#5c3d1e] font-semibold">Available Puppies</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-[#5c3d1e] font-semibold">About Us</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-[#5c3d1e] font-semibold">Contact</Link>
          <Link href="/puppies" onClick={() => setMenuOpen(false)} className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold text-center hover:bg-[#a07850] transition-colors">
            Find Your Puppy
          </Link>
        </div>
      )}

      {/* ── Hero ── */}
      <section
        className="relative h-[80vh] md:h-[90vh] overflow-hidden"
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
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-5 md:px-8">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Raised with Love, Born for Family
          </h1>
          <p className="text-base md:text-xl text-white/90 mb-2 font-semibold">
            Trusted breeders of Labradors, Poodles & German Shepherds
          </p>
          <p className="text-white/75 mb-8 text-sm md:text-base">Dallas, Texas — Nationwide Delivery Available</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
            <Link href="/puppies" className="bg-[#5c3d1e] text-white px-8 py-3 rounded-full text-base md:text-lg font-bold hover:bg-[#a07850] transition-colors text-center">
              Browse Available Puppies
            </Link>
            <a href="https://wa.me/17025461964" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-[#5c3d1e] transition-colors">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured Puppies ── */}
      <FeaturedPuppies />

      {/* ── Breeds Section ── */}
      <section className="px-5 md:px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#5c3d1e] mb-3">Our Breeds</h2>
        <p className="text-[#a07850] mb-10 text-base md:text-lg">Hand raised on our farm in Dallas, Texas</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { breed: 'Labrador Retriever', image: '/labrador.jpg' },
            { breed: 'Poodle', image: '/poodle.jpg' },
            { breed: 'German Shepherd', image: '/german-shepherd.jpg' },
          ].map((item) => (
            <Link href={`/puppies?breed=${item.breed}`} key={item.breed}
              className="bg-white border-2 border-[#e8d5b7] rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#a07850] transition-all">
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

      {/* ── Why Choose Us ── */}
      <section className="bg-[#5c3d1e] text-white px-5 md:px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-10 md:mb-12">Why Heritage Kennels?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { icon: '❤️', title: 'Raised with Love', desc: 'Every puppy is hand raised on our family farm' },
            { icon: '🏥', title: 'Health Checked', desc: 'Vet certified with full vaccination records' },
            { icon: '🚚', title: 'Nationwide Delivery', desc: 'Safe delivery across all 50 states' },
            { icon: '📞', title: 'Lifetime Support', desc: 'We are always here for you and your pup' },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">{item.icon}</div>
              <h3 className="font-black text-base md:text-lg mb-2">{item.title}</h3>
              <p className="text-[#e8d5b7] text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-5 md:px-8 py-16 md:py-20 text-center bg-[#fdf6ee]">
        <h2 className="text-3xl md:text-4xl font-black text-[#5c3d1e] mb-10 md:mb-12">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Browse Puppies', desc: 'Explore our available puppies by breed' },
            { step: '2', title: 'Pick Your Pup', desc: 'Find the perfect puppy for your family' },
            { step: '3', title: 'Contact Us', desc: 'Reach out via Facebook or Instagram' },
            { step: '4', title: 'Welcome Home', desc: 'Local pickup or nationwide delivery' },
          ].map((item) => (
            <div key={item.step}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#5c3d1e] text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-black mx-auto mb-3 md:mb-4">
                {item.step}
              </div>
              <h3 className="font-black text-base md:text-lg text-[#5c3d1e] mb-2">{item.title}</h3>
              <p className="text-[#a07850] text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-white px-5 md:px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#5c3d1e] mb-10 md:mb-12">Happy Puppy Parents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Sarah M.', location: 'Austin, TX', review: 'Our Labrador Max is the most loving dog. Heritage Kennels made the whole process so easy and stress free!', stars: 5 },
            { name: 'James K.', location: 'New York, NY', review: 'The German Shepherd we got is incredible. Delivered safely all the way to New York. Highly recommend!', stars: 5 },
            { name: 'Linda T.', location: 'Los Angeles, CA', review: 'Our Poodle is so healthy and well raised. You can tell these puppies are raised with real love and care.', stars: 5 },
          ].map((review) => (
            <div key={review.name} className="bg-[#fdf6ee] rounded-3xl p-6 md:p-8 text-left border-2 border-[#e8d5b7]">
              <div className="text-yellow-400 text-xl mb-3">{'⭐'.repeat(review.stars)}</div>
              <p className="text-[#5c3d1e] mb-4 italic text-sm md:text-base">"{review.review}"</p>
              <p className="font-black text-[#5c3d1e]">{review.name}</p>
              <p className="text-[#a07850] text-sm">{review.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#e8d5b7] px-5 md:px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#5c3d1e] mb-4">Ready to Find Your Perfect Pup?</h2>
        <p className="text-[#a07850] text-base md:text-lg mb-8">Browse our available puppies or reach out to us directly</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-sm mx-auto sm:max-w-none sm:w-auto">
          <Link href="/puppies" className="bg-[#5c3d1e] text-white px-8 py-3 rounded-full text-base md:text-lg font-bold hover:bg-[#a07850] transition-colors text-center">
            Browse Puppies
          </Link>
          <Link href="/contact" className="border-2 border-[#5c3d1e] text-[#5c3d1e] px-8 py-3 rounded-full text-base md:text-lg font-bold hover:bg-[#5c3d1e] hover:text-white transition-colors text-center">
            Contact Us
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#3a2410] text-white px-5 md:px-8 py-10 text-center">
        <p className="text-2xl md:text-3xl font-black mb-1">Heritage Kennels</p>
        <p className="text-[#a07850] text-sm mb-6">The Farmer's Dog — Dallas, Texas</p>
        <div className="flex flex-wrap justify-center gap-5 md:gap-8 text-sm text-[#e8d5b7] mb-6">
          <Link href="/puppies" className="hover:text-white">Available Puppies</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
        <p className="text-[#a07850] text-xs">© 2026 Heritage Kennels. All rights reserved.</p>
      </footer>
    </main>
  )
}
