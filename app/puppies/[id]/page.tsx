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

const WHATS_INCLUDED = [
  'Health guarantee',
  'Microchip',
  'Nose-to-tail veterinarian health check',
  'Vaccinations & deworming',
  'Vet records',
  'Nationwide delivery options',
  'Lifetime breeder support',
]

const DELIVERY_OPTIONS = [
  {
    title: 'Door-to-door delivery',
    desc: 'No travel required. We bring your pup directly to your home anywhere in the US. Safe, climate-controlled transport from our farm in Dallas, Texas to your doorstep.',
  },
  {
    title: 'Delivery near your home',
    desc: 'We deliver to a meeting point within a comfortable drive from your home. A practical and popular option for most families.',
  },
  {
    title: 'Pick up in Dallas',
    desc: 'Come visit us at our farm in Dallas, Texas and pick up your puppy in person. Meet the puppy before taking them home.',
  },
]

const REVIEWS = [
  {
    name: 'Sarah M.',
    location: 'Austin, TX',
    date: 'March 2026',
    review: 'Our Labrador Max is the most loving dog. Heritage Kennels made the whole process so easy and stress free! Highly recommend to anyone looking for a quality puppy.',
  },
  {
    name: 'James K.',
    location: 'New York, NY',
    date: 'January 2026',
    review: 'The German Shepherd we got is incredible. Delivered safely all the way to New York. The team was communicative throughout the whole process.',
  },
  {
    name: 'Linda T.',
    location: 'Los Angeles, CA',
    date: 'February 2026',
    review: 'Our Poodle is so healthy and well raised. You can tell these puppies are raised with real love and care. Amazing experience from start to finish.',
  },
]

const breedFacts: Record<string, { temperament: string; energy: string; group: string }> = {
  'Labrador Retriever': { temperament: 'Friendly, Outgoing, Active', energy: 'High', group: 'Sporting' },
  'Poodle': { temperament: 'Intelligent, Elegant, Playful', energy: 'Medium', group: 'Non-Sporting' },
  'German Shepherd': { temperament: 'Confident, Courageous, Smart', energy: 'High', group: 'Herding' },
}

const breedImages: Record<string, string> = {
  'Labrador Retriever': '/labrador.jpg',
  'Poodle': '/poodle.jpg',
  'German Shepherd': '/german-shepherd.jpg',
}

export default function PuppyPage() {
  const { id } = useParams()
  const [puppy, setPuppy] = useState<Puppy | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [expandedDelivery, setExpandedDelivery] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
    ? 'Ready to go home'
    : `Ready by ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  const facts = breedFacts[puppy.breed]

  return (
    <main className="min-h-screen bg-[#fdf6ee]">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-5 md:px-8 py-4 bg-[#fdf6ee] shadow-sm sticky top-0 z-40">
        <Link href="/">
          <div>
            <p className="text-xl md:text-2xl font-black text-[#5c3d1e]">Heritage Kennels</p>
            <p className="text-xs text-[#a07850]">The Farmer's Dog</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/puppies" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Available Puppies</Link>
          <Link href="/about" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">About Us</Link>
          <Link href="/contact" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Contact</Link>
          <Link href="/puppies" className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold hover:bg-[#a07850] transition-colors">
            Find Your Puppy
          </Link>
        </div>
        <button className="md:hidden text-[#5c3d1e] text-2xl font-black" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#e8d5b7] px-5 py-4 flex flex-col gap-4 z-30">
          <Link href="/puppies" onClick={() => setMenuOpen(false)} className="text-[#5c3d1e] font-semibold">Available Puppies</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-[#5c3d1e] font-semibold">About Us</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-[#5c3d1e] font-semibold">Contact</Link>
          <Link href="/puppies" onClick={() => setMenuOpen(false)} className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold text-center">
            Find Your Puppy
          </Link>
        </div>
      )}

      {/* ── Breadcrumbs ── */}
      <div className="px-5 md:px-8 py-3 text-sm text-[#a07850] max-w-7xl mx-auto flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-[#5c3d1e]">Heritage Kennels</Link>
        <span>/</span>
        <Link href="/puppies" className="hover:text-[#5c3d1e]">Available Puppies</Link>
        <span>/</span>
        <Link href={`/puppies?breed=${puppy.breed}`} className="hover:text-[#5c3d1e]">{puppy.breed}</Link>
        <span>/</span>
        <span className="text-[#5c3d1e] font-bold">{puppy.name}</span>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-24 md:pb-16 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 md:gap-10 items-start">

        {/* ── LEFT ── */}
        <div>

          {/* Gallery */}
          <div className="flex gap-3 mb-6 md:mb-8">
            {/* Thumbnails — side column on desktop, hidden on mobile */}
            {puppy.images?.length > 1 && (
              <div className="hidden md:flex flex-col gap-2">
                {puppy.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === index ? 'border-[#5c3d1e]' : 'border-[#e8d5b7] hover:border-[#a07850]'
                    }`}
                  >
                    <Image src={img} alt={`${puppy.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative flex-1 aspect-[4/3] bg-[#e8d5b7] rounded-2xl md:rounded-3xl overflow-hidden">
              {puppy.images?.[activeImage] ? (
                <Image src={puppy.images[activeImage]} alt={puppy.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
              )}
              {puppy.is_champion_bloodline && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs md:text-sm font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full">
                  ⭐ Champion bloodline
                </span>
              )}
              <span className={`absolute bottom-3 left-3 text-xs md:text-sm font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full ${isReady ? 'bg-green-500 text-white' : 'bg-white text-[#5c3d1e]'}`}>
                {readyLabel}
              </span>
              <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">
                {activeImage + 1} / {puppy.images?.length || 1}
              </span>
            </div>
          </div>

          {/* Mobile thumbnails — horizontal row */}
          {puppy.images?.length > 1 && (
            <div className="flex md:hidden gap-2 mb-5 overflow-x-auto pb-1">
              {puppy.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === index ? 'border-[#5c3d1e]' : 'border-[#e8d5b7]'
                  }`}
                >
                  <Image src={img} alt={`${puppy.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Mobile sticky CTA — shown only on mobile, above content */}
          <div className="md:hidden bg-white rounded-2xl border-2 border-[#e8d5b7] p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-2xl font-black text-[#5c3d1e]">${puppy.price.toLocaleString()}</p>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${isReady ? 'bg-green-100 text-green-700' : 'bg-[#fdf6ee] text-[#5c3d1e]'}`}>
                {isReady ? '✅ Ready now' : `🗓 ${readyLabel}`}
              </span>
            </div>
            <a
              href="https://www.facebook.com/YOUR_PAGE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1877F2] text-white py-3 rounded-full font-black text-center block"
            >
              📘 Message us on Facebook
            </a>
            <p className="text-center text-[#a07850] text-xs mt-2">
              Mention <span className="font-black text-[#5c3d1e]">{puppy.name}</span> when you reach out!
            </p>
          </div>

          {/* Puppy name + status */}
          <div className="mb-5 md:mb-6">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-black text-[#5c3d1e]">{puppy.name}</h1>
              <span className="bg-green-100 text-green-700 text-sm font-black px-3 py-1 rounded-full">• Available</span>
            </div>
            <p className="text-[#a07850] font-semibold text-sm md:text-base">
              {puppy.breed} · {puppy.gender} · {puppy.age_weeks} weeks old · {readyLabel}
            </p>
          </div>

          {/* Quick details */}
          <div className="bg-white rounded-2xl border-2 border-[#e8d5b7] p-5 md:p-6 mb-6 md:mb-8">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div>
                <p className="text-xs font-black text-[#a07850] uppercase mb-1">Birthday</p>
                <p className="font-black text-[#5c3d1e] text-sm md:text-base">
                  {new Date(new Date().setDate(new Date().getDate() - puppy.age_weeks * 7)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs font-black text-[#a07850] uppercase mb-1">Gender</p>
                <p className="font-black text-[#5c3d1e] text-sm md:text-base">{puppy.gender}</p>
              </div>
              <div>
                <p className="text-xs font-black text-[#a07850] uppercase mb-1">Breed</p>
                <p className="font-black text-[#5c3d1e] text-sm md:text-base">{puppy.breed}</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-4">Learn about {puppy.name}</h2>
            <div className="bg-white rounded-2xl border-2 border-[#e8d5b7] p-5 md:p-6">
              <p className="text-xs font-black text-[#a07850] uppercase mb-1">
                {puppy.breed} · {puppy.gender} · {puppy.age_weeks} weeks old · {readyLabel}
              </p>
              <h3 className="text-lg font-black text-[#5c3d1e] mb-3">Hi, I'm {puppy.name}!</h3>
              <p className="text-[#5c3d1e] leading-relaxed text-sm md:text-base">
                {puppy.description || `Hi, I'm ${puppy.name}! I'm a ${puppy.age_weeks}-week-old ${puppy.gender.toLowerCase()} ${puppy.breed} raised with love on Heritage Kennels farm in Dallas, Texas. I'll be ready to go home ${isReady ? 'now' : `after ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}. I'm dreaming of belly rubs and cozy snuggles with you!`}
              </p>
            </div>
          </div>

          {/* What's included */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-4">What's included when bringing {puppy.name} home</h2>
            <div className="bg-white rounded-2xl border-2 border-[#e8d5b7] p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WHATS_INCLUDED.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-green-500 font-black text-lg shrink-0">✓</span>
                    <p className="text-[#5c3d1e] font-semibold text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-4">Health</h2>
            <div className="bg-white rounded-2xl border-2 border-[#e8d5b7] p-5 md:p-6 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl shrink-0">💉</span>
                <div>
                  <p className="font-black text-[#5c3d1e] mb-1 text-sm md:text-base">Vaccinations & deworming</p>
                  <p className="text-[#a07850] text-sm leading-relaxed">{puppy.name} will be current on vaccinations before going home. Full records provided.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl shrink-0">🏥</span>
                <div>
                  <p className="font-black text-[#5c3d1e] mb-1 text-sm md:text-base">Nose-to-tail veterinarian health check</p>
                  <p className="text-[#a07850] text-sm leading-relaxed">{puppy.name} will receive a full vet check before going home. You will receive copies of all health records.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video */}
          {puppy.video_url && (
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-4">🎥 Watch {puppy.name} in action</h2>
              <video src={puppy.video_url} controls className="w-full rounded-2xl md:rounded-3xl border-2 border-[#e8d5b7]" />
            </div>
          )}

          {/* Reviews */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-4">Customer Reviews</h2>
            <div className="flex flex-col gap-4">
              {REVIEWS.map((review) => (
                <div key={review.name} className="bg-white rounded-2xl border-2 border-[#e8d5b7] p-5 md:p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                  </div>
                  <p className="text-[#5c3d1e] leading-relaxed mb-3 italic text-sm md:text-base">"{review.review}"</p>
                  <p className="font-black text-[#5c3d1e] text-sm">{review.name}</p>
                  <p className="text-[#a07850] text-xs">{review.location} · {review.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-2">Bringing {puppy.name} home</h2>
            <p className="text-[#a07850] mb-4 text-sm md:text-base">Nationwide delivery available no matter where you are</p>
            <div className="flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((option, index) => (
                <div key={option.title} className="bg-white rounded-2xl border-2 border-[#e8d5b7] overflow-hidden">
                  <button
                    onClick={() => setExpandedDelivery(expandedDelivery === index ? null : index)}
                    className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left"
                  >
                    <p className="font-black text-[#5c3d1e] text-sm md:text-base">{option.title}</p>
                    <span className="text-[#a07850] font-black">{expandedDelivery === index ? '−' : '+'}</span>
                  </button>
                  {expandedDelivery === index && (
                    <div className="px-5 md:px-6 pb-4">
                      <p className="text-[#a07850] text-sm leading-relaxed">{option.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 bg-[#fdf6ee] border-2 border-[#e8d5b7] rounded-2xl p-4 md:p-5">
              <p className="text-sm text-[#5c3d1e] leading-relaxed">
                <span className="font-black">When is {puppy.name} ready to leave?</span> Young puppies have delicate immune systems. {puppy.name} must be at least 8 weeks old before traveling. {isReady ? `${puppy.name} is ready now!` : `${puppy.name} will be ready by ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`} Contact us to arrange the best delivery option for your family.
              </p>
            </div>
          </div>

          {/* About the breed */}
          {facts && (
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black text-[#5c3d1e] mb-4">About the breed</h2>
              <div className="bg-white rounded-2xl border-2 border-[#e8d5b7] overflow-hidden flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-48 shrink-0">
                  <Image src={breedImages[puppy.breed] || '/labrador.jpg'} alt={puppy.breed} fill className="object-cover" />
                </div>
                <div className="p-5 md:p-6 flex-1">
                  <p className="text-xs font-black text-[#a07850] uppercase mb-2">About breed</p>
                  <h3 className="text-lg font-black text-[#5c3d1e] mb-4">Quick facts about {puppy.breed}s</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <p className="text-xs font-black text-[#a07850] uppercase w-24 shrink-0">Temperament</p>
                      <p className="text-sm font-bold text-[#5c3d1e]">{facts.temperament}</p>
                    </div>
                    <div className="flex gap-4">
                      <p className="text-xs font-black text-[#a07850] uppercase w-24 shrink-0">Energy</p>
                      <p className="text-sm font-bold text-[#5c3d1e]">{facts.energy}</p>
                    </div>
                    <div className="flex gap-4">
                      <p className="text-xs font-black text-[#a07850] uppercase w-24 shrink-0">Breed Group</p>
                      <p className="text-sm font-bold text-[#5c3d1e]">{facts.group}</p>
                    </div>
                  </div>
                  <Link href={`/puppies?breed=${puppy.breed}`} className="inline-block mt-4 text-sm font-black text-[#a07850] hover:text-[#5c3d1e] underline">
                    Learn more about {puppy.breed}s →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT sticky panel — desktop only ── */}
        <div className="hidden md:block sticky top-[80px]">
          <div className="bg-white rounded-3xl border-2 border-[#e8d5b7] p-6">
            <div className="mb-4">
              <p className="text-xs font-black text-[#a07850] uppercase mb-1">Bring home fee</p>
              <p className="text-4xl font-black text-[#5c3d1e]">${puppy.price.toLocaleString()}</p>
              <p className="text-xs text-[#a07850] mt-1">Contact us for payment options</p>
            </div>

            <hr className="border-[#e8d5b7] mb-4" />

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${puppy.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {puppy.gender === 'Male' ? '♂ Male' : '♀ Female'}
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e8d5b7] text-[#5c3d1e]">{puppy.breed}</span>
              {puppy.is_champion_bloodline && (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">⭐ Champion</span>
              )}
            </div>

            <div className={`rounded-2xl px-4 py-3 mb-5 text-center font-black text-sm ${isReady ? 'bg-green-100 text-green-700' : 'bg-[#fdf6ee] text-[#5c3d1e]'}`}>
              {isReady ? '✅ Ready to go home now!' : `🗓 ${readyLabel}`}
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <a href="https://www.facebook.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer"
                className="w-full bg-[#1877F2] text-white py-4 rounded-full font-black text-center hover:opacity-90 transition-opacity block">
                📘 Message us on Facebook
              </a>
            </div>

            <p className="text-center text-[#a07850] text-xs mb-5">
              Mention <span className="font-black text-[#5c3d1e]">{puppy.name}</span> when you reach out!
            </p>

            <hr className="border-[#e8d5b7] mb-4" />

            <p className="text-xs font-black text-[#a07850] uppercase mb-3">What's included</p>
            <div className="flex flex-col gap-2">
              {WHATS_INCLUDED.slice(0, 5).map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-green-500 font-black shrink-0">✓</span>
                  <p className="text-xs font-semibold text-[#5c3d1e]">{item}</p>
                </div>
              ))}
            </div>

            <hr className="border-[#e8d5b7] my-4" />

            <p className="text-xs text-[#a07850] text-center leading-relaxed">
              🔒 <span className="font-black text-[#5c3d1e]">Safe & secure process.</span> We'll walk you through every step. No surprises.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom CTA bar ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t-2 border-[#e8d5b7] px-5 py-3 z-50 flex items-center gap-3">
        <div>
          <p className="text-xs text-[#a07850] font-bold">{puppy.name}</p>
          <p className="text-lg font-black text-[#5c3d1e]">${puppy.price.toLocaleString()}</p>
        </div>
        <a
          href="https://www.facebook.com/YOUR_PAGE"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1877F2] text-white py-3 rounded-full font-black text-center text-sm"
        >
          📘 Message on Facebook
        </a>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#3a2410] text-white px-5 md:px-8 pt-10 md:pt-12 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10 text-sm">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl md:text-2xl font-black mb-1">Heritage Kennels</p>
              <p className="text-[#a07850] text-xs mb-4">The Farmer's Dog — Dallas, Texas</p>
              <p className="text-[#e8d5b7]/70 text-xs leading-relaxed">Raising healthy, happy puppies on our family farm since 2010.</p>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">Explore</p>
              <div className="flex flex-col gap-2 text-[#e8d5b7]">
                <Link href="/puppies" className="hover:text-white">Available Puppies</Link>
                <Link href="/about" className="hover:text-white">About Us</Link>
                <Link href="/contact" className="hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">For Puppy Parents</p>
              <div className="flex flex-col gap-2 text-[#e8d5b7]">
                <Link href="/delivery" className="hover:text-white">Delivery Options</Link>
                <Link href="/health-guarantee" className="hover:text-white">Health Guarantee</Link>
                <Link href="/faq" className="hover:text-white">FAQs</Link>
              </div>
            </div>
          </div>
          <hr className="border-[#5c3d1e] mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a07850]">
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
