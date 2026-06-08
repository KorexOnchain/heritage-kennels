'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Puppy = {
  id: string
  name: string
  breed: string
  gender: string
  age_weeks: number
  price: number
  ready_date: string
  description: string
  images: string[]
  video_url: string
  is_available: boolean
  is_champion_bloodline: boolean
}

const TRUST_BADGES = [
  {
    icon: '🏥',
    title: 'Health Guarantee',
    desc: 'Every puppy comes with a full health guarantee from our licensed vet',
  },
  {
    icon: '🚚',
    title: 'Nationwide Delivery',
    desc: 'Safe, climate-controlled delivery straight to your door',
  },
  {
    icon: '🐾',
    title: 'Raised on Our Farm',
    desc: 'Born and raised by us on our family farm in Dallas, Texas',
  },
  {
    icon: '💉',
    title: 'Up-to-Date Vaccines',
    desc: 'All puppies are vaccinated and vet-checked before going home',
  },
]

export default function PuppyPage() {
  const { id } = useParams()
  const [puppy, setPuppy] = useState<Puppy | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchPuppy()
  }, [id])

  async function fetchPuppy() {
    const { data, error } = await supabase
      .from('puppies')
      .select('*')
      .eq('id', id)
      .single()
    if (error) console.error(error)
    else setPuppy(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
      <p className="text-[#a07850] text-xl font-bold">Loading puppy...</p>
    </div>
  )

  if (!puppy) return (
    <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
      <p className="text-[#5c3d1e] text-xl font-bold">Puppy not found</p>
    </div>
  )

  const isReady = new Date(puppy.ready_date) <= new Date()
  const readyLabel = isReady
    ? '✅ Ready to go home'
    : `Ready by ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`

  return (
    <main className="min-h-screen bg-[#fdf6ee]">

      {/* ── Top utility bar ── */}
      <div className="bg-[#3a2410] text-white text-sm px-6 py-2 flex items-center justify-between">
        <a href="tel:+15551234567" className="hover:text-[#e8d5b7] transition-colors flex items-center gap-2">
          📞 Call our puppy concierges: <strong>(555) 123-4567</strong> · 8am – midnight
        </a>
        <Link href="/delivery" className="hover:text-[#e8d5b7] transition-colors">
          🚚 We deliver nationwide →
        </Link>
      </div>

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#fdf6ee] shadow-sm sticky top-0 z-40">
        <Link href="/">
          <div>
            <p className="text-2xl font-black text-[#5c3d1e]">Heritage Kennels</p>
            <p className="text-xs text-[#a07850]">The Farmer's Dog</p>
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/puppies" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Available Puppies</Link>
          <Link href="/about" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">About Us</Link>
          <Link href="/contact" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Contact</Link>
          <Link href="/puppies" className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold hover:bg-[#a07850] transition-colors">
            Find Your Puppy
          </Link>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="px-8 py-3 text-sm text-[#a07850] max-w-6xl mx-auto flex items-center gap-1">
        <Link href="/" className="hover:text-[#5c3d1e]">Heritage Kennels</Link>
        <span>/</span>
        <Link href="/puppies" className="hover:text-[#5c3d1e]">Available Puppies</Link>
        <span>/</span>
        <Link href={`/puppies?breed=${puppy.breed}`} className="hover:text-[#5c3d1e]">{puppy.breed}</Link>
        <span>/</span>
        <span className="text-[#5c3d1e] font-bold">{puppy.name}</span>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-[1fr_420px] gap-12 items-start">

        {/* ── LEFT: Gallery ── */}
        <div>
          {/* Main image */}
          <div className="relative aspect-[4/3] bg-[#e8d5b7] rounded-3xl overflow-hidden mb-4">
            {puppy.images?.[activeImage] ? (
              <Image
                src={puppy.images[activeImage]}
                alt={puppy.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
            )}
            {puppy.is_champion_bloodline && (
              <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm font-black px-4 py-1.5 rounded-full shadow">
                ⭐ Champion Bloodline
              </span>
            )}
            {/* Ready status pill */}
            <span className={`absolute bottom-4 left-4 text-sm font-black px-4 py-1.5 rounded-full shadow ${isReady ? 'bg-green-500 text-white' : 'bg-white text-[#5c3d1e]'}`}>
              {readyLabel}
            </span>
          </div>

          {/* Thumbnails */}
          {puppy.images?.length > 1 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {puppy.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === index ? 'border-[#5c3d1e] shadow-md' : 'border-[#e8d5b7] hover:border-[#a07850]'
                  }`}
                >
                  <Image src={img} alt={`${puppy.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Video */}
          {puppy.video_url && (
            <div className="mt-4">
              <p className="text-xs font-black text-[#a07850] uppercase mb-2">🎥 Watch {puppy.name} in action</p>
              <video src={puppy.video_url} controls className="w-full rounded-3xl border-2 border-[#e8d5b7]" />
            </div>
          )}

          {/* Trust badges — shown below gallery on detail page */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className="bg-white rounded-2xl border-2 border-[#e8d5b7] p-4 flex items-start gap-3">
                <span className="text-2xl shrink-0">{badge.icon}</span>
                <div>
                  <p className="font-black text-[#5c3d1e] text-sm">{badge.title}</p>
                  <p className="text-[#a07850] text-xs leading-relaxed mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Info + CTA ── */}
        <div className="sticky top-[80px]">

          {/* Gender + breed tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              puppy.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
            }`}>
              {puppy.gender === 'Male' ? '♂ Male' : '♀ Female'}
            </span>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e8d5b7] text-[#5c3d1e]">
              {puppy.breed}
            </span>
          </div>

          {/* Name + price */}
          <h1 className="text-5xl font-black text-[#5c3d1e] leading-tight mb-1">{puppy.name}</h1>
          <p className="text-3xl font-black text-[#a07850] mb-6">${puppy.price.toLocaleString()}</p>

          {/* Quick facts grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Age', value: `${puppy.age_weeks} weeks old` },
              { label: 'Gender', value: puppy.gender },
              { label: 'Breed', value: puppy.breed },
              { label: 'Ready Date', value: isReady ? 'Now!' : new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-4 border-2 border-[#e8d5b7]">
                <p className="text-xs font-black text-[#a07850] uppercase mb-1">{item.label}</p>
                <p className="font-black text-[#5c3d1e]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {puppy.description && (
            <div className="bg-white rounded-2xl p-5 border-2 border-[#e8d5b7] mb-6">
              <p className="text-xs font-black text-[#a07850] uppercase mb-2">About {puppy.name}</p>
              <p className="text-[#5c3d1e] leading-relaxed text-sm">{puppy.description}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <a
              href="https://www.facebook.com/YOUR_PAGE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1877F2] text-white py-4 rounded-full font-black text-center text-lg hover:opacity-90 transition-opacity block shadow-lg"
            >
              📘 Message us on Facebook
            </a>
            <a
              href="tel:+15551234567"
              className="w-full bg-[#5c3d1e] text-white py-4 rounded-full font-black text-center text-lg hover:bg-[#a07850] transition-colors block shadow-lg"
            >
              📞 Call Us About {puppy.name}
            </a>
            <p className="text-center text-[#a07850] text-sm">
              Mention <span className="font-black text-[#5c3d1e]">{puppy.name}</span> when you reach out!
            </p>
          </div>

          {/* Small trust note */}
          <div className="mt-5 bg-[#fdf6ee] border-2 border-[#e8d5b7] rounded-2xl p-4 text-center">
            <p className="text-xs text-[#a07850] leading-relaxed">
              🔒 <span className="font-black text-[#5c3d1e]">Safe & secure process.</span> We'll walk you through everything step by step. No surprises.
            </p>
          </div>
        </div>
      </div>

      {/* ── More from this breed ── */}
      <div className="max-w-6xl mx-auto px-8 py-4 pb-16">
        <div className="border-t-2 border-[#e8d5b7] pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#5c3d1e]">More {puppy.breed} Puppies</h2>
            <Link
              href={`/puppies?breed=${encodeURIComponent(puppy.breed)}`}
              className="text-sm font-black text-[#a07850] hover:text-[#5c3d1e] transition-colors"
            >
              See all {puppy.breed}s →
            </Link>
          </div>
          {/* This is a placeholder row — you can wire up a real query here later */}
          <div className="bg-white rounded-3xl border-2 border-[#e8d5b7] p-8 text-center">
            <p className="text-[#a07850] font-bold text-sm">
              Browse all available {puppy.breed} puppies from Heritage Kennels
            </p>
            <Link
              href={`/puppies?breed=${encodeURIComponent(puppy.breed)}`}
              className="inline-block mt-4 bg-[#5c3d1e] text-white px-8 py-3 rounded-full font-black hover:bg-[#a07850] transition-colors"
            >
              View All {puppy.breed}s
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#3a2410] text-white px-8 pt-12 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-10 text-sm">
            <div>
              <p className="text-2xl font-black mb-1">Heritage Kennels</p>
              <p className="text-[#a07850] text-xs mb-4">The Farmer's Dog — Dallas, Texas</p>
              <p className="text-[#e8d5b7]/70 text-xs leading-relaxed">
                Raising healthy, happy puppies on our family farm since 2010.
              </p>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">Explore</p>
              <div className="flex flex-col gap-2 text-[#e8d5b7]">
                <Link href="/puppies" className="hover:text-white transition-colors">Available Puppies</Link>
                <Link href="/breeds" className="hover:text-white transition-colors">All Breeds</Link>
                <Link href="/collections" className="hover:text-white transition-colors">By Lifestyle</Link>
                <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">For Puppy Parents</p>
              <div className="flex flex-col gap-2 text-[#e8d5b7]">
                <Link href="/delivery" className="hover:text-white transition-colors">Delivery Options</Link>
                <Link href="/health-guarantee" className="hover:text-white transition-colors">Health Guarantee</Link>
                <Link href="/faq" className="hover:text-white transition-colors">FAQs</Link>
                <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">Need Guidance?</p>
              <a href="tel:+15551234567" className="text-white font-black text-lg hover:text-[#e8d5b7] transition-colors block mb-1">
                (555) 123-4567
              </a>
              <p className="text-[#a07850] text-xs mb-5">Everyday 8AM – Midnight CST</p>
              <Link href="/contact" className="inline-block bg-[#a07850] hover:bg-[#5c3d1e] text-white text-sm font-bold px-5 py-2 rounded-full transition-colors border border-[#a07850]">
                Contact Us
              </Link>
            </div>
          </div>
          <hr className="border-[#5c3d1e] mb-4" />
          <div className="flex items-center justify-between text-xs text-[#a07850]">
            <p>© 2026 Heritage Kennels. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
