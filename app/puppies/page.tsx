'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Puppy = {
  id: string
  name: string
  breed: string
  gender: string
  age_weeks: number
  price: number
  ready_date: string
  images: string[]
  is_available: boolean
  is_champion_bloodline: boolean
}

const breedInfo = {
  'Labrador Retriever': {
    traits: 'Friendly • Outgoing • Active',
    description: 'Labrador Retrievers are one of the most popular breeds in America. Known for their friendly nature, intelligence, and loyalty, they make perfect family companions. Our Labs are raised on our farm in Dallas, Texas with love and care.',
    temperament: 'Friendly, Outgoing, Active',
    energy: 'High',
    group: 'Sporting',
    collections: ['Active dog breeds', 'Best family dogs', 'Best with kids'],
    learnMoreHref: '/breeds/labrador-retriever',
  },
  'Poodle': {
    traits: 'Intelligent • Elegant • Playful',
    description: 'Poodles are one of the smartest dog breeds in the world. Highly trainable, hypoallergenic, and incredibly loving, they are perfect for families of all sizes. Our Poodles are raised with care on our Dallas farm.',
    temperament: 'Intelligent, Elegant, Playful',
    energy: 'Medium',
    group: 'Non-Sporting',
    collections: ['Allergy-friendly breeds', 'Best apartment dogs'],
    learnMoreHref: '/breeds/poodle',
  },
  'German Shepherd': {
    traits: 'Confident • Courageous • Smart',
    description: 'German Shepherds are loyal, confident, and incredibly smart dogs. Known for their versatility and protective nature, they make outstanding family dogs and companions. Our German Shepherds are hand raised on our farm in Dallas, Texas.',
    temperament: 'Confident, Courageous, Smart',
    energy: 'High',
    group: 'Herding',
    collections: ['Active dog breeds', 'Best family dogs'],
    learnMoreHref: '/breeds/german-shepherd',
  },
}

const breedImages: Record<string, string> = {
  'Labrador Retriever': '/labrador.jpg',
  'Poodle': '/poodle.jpg',
  'German Shepherd': '/german-shepherd.jpg',
}

const LIFESTYLE_COLLECTIONS = [
  { label: 'Doodle breeds', href: '/collections/doodle-puppies' },
  { label: 'Best apartment breeds', href: '/collections/best-apartment-dogs' },
  { label: 'Teacup breeds', href: '/collections/teacup-puppies' },
  { label: 'Best family breeds', href: '/collections/best-family-dogs' },
  { label: 'Allergy-friendly breeds', href: '/collections/allergy-friendly-dogs' },
  { label: 'Top active breeds', href: '/collections/active-dogs' },
]

const PHOTO_REVIEWS = [
  {
    name: 'Sarah M.',
    location: 'Austin, TX',
    review: 'Our Labrador Max is the most loving dog. Heritage Kennels made the whole process so easy and stress free!',
    stars: 5,
    image: '/reviews/sarah-max.jpg', // real puppy photo here
    date: 'March 2026',
  },
  {
    name: 'James K.',
    location: 'New York, NY',
    review: 'The German Shepherd we got is incredible. Delivered safely all the way to New York. Highly recommend!',
    stars: 5,
    image: '/reviews/james-shepherd.jpg',
    date: 'January 2026',
  },
  {
    name: 'Linda T.',
    location: 'Los Angeles, CA',
    review: 'Our Poodle is so healthy and well raised. You can tell these puppies are raised with real love and care.',
    stars: 5,
    image: '/reviews/linda-poodle.jpg',
    date: 'February 2026',
  },
]
type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'age_asc' | 'ready_soon'

export default function PuppiesPage() {
  const [puppies, setPuppies] = useState<Puppy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBreed, setSelectedBreed] = useState('All')
  const [selectedGender, setSelectedGender] = useState('All')
  const [readyNow, setReadyNow] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showSort, setShowSort] = useState(false)

  useEffect(() => {
    fetchPuppies()
  }, [])

  async function fetchPuppies() {
    const { data, error } = await supabase
      .from('puppies')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setPuppies(data || [])
    setLoading(false)
  }

  const filtered = puppies
    .filter((p) => {
      const breedMatch = selectedBreed === 'All' || p.breed === selectedBreed
      const genderMatch = selectedGender === 'All' || p.gender === selectedGender
      const readyMatch = !readyNow || new Date(p.ready_date) <= new Date()
      return breedMatch && genderMatch && readyMatch
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'age_asc') return a.age_weeks - b.age_weeks
      if (sortBy === 'ready_soon')
        return new Date(a.ready_date).getTime() - new Date(b.ready_date).getTime()
      return 0 // newest = default supabase order
    })

  const activeBreed = selectedBreed !== 'All' ? breedInfo[selectedBreed as keyof typeof breedInfo] : null

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    price_asc: 'Price: Low to High',
    price_desc: 'Price: High to Low',
    age_asc: 'Youngest First',
    ready_soon: 'Ready Soonest',
  }

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

      {/* ── Breed Header ── */}
      <section className="bg-[#5c3d1e] text-white px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="text-sm text-[#e8d5b7] mb-4 flex items-center gap-1">
            <Link href="/" className="hover:text-white">Heritage Kennels</Link>
            <span>/</span>
            <Link href="/puppies" className="hover:text-white">Available Puppies</Link>
            {selectedBreed !== 'All' && (
              <>
                <span>/</span>
                <span className="text-white">{selectedBreed}</span>
              </>
            )}
          </nav>

          <h1 className="text-5xl font-black mb-2">
            {selectedBreed === 'All' ? 'Available Puppies' : `${selectedBreed} Puppies`}
          </h1>
          {activeBreed && (
            <p className="text-[#e8d5b7] text-lg font-semibold mb-4">{activeBreed.traits}</p>
          )}
          {activeBreed && (
            <div className="max-w-2xl">
              <p className="text-white/80 leading-relaxed">
                {expanded ? activeBreed.description : `${activeBreed.description.slice(0, 120)}...`}
                <button onClick={() => setExpanded(!expanded)} className="ml-2 text-[#e8d5b7] font-black underline">
                  {expanded ? 'Read less' : 'Read more'}
                </button>
              </p>
            </div>
          )}
          {selectedBreed === 'All' && (
            <p className="text-[#e8d5b7]">Find your perfect companion from our farm in Dallas, Texas</p>
          )}
        </div>
      </section>

      {/* ── Breed Filter Tabs ── */}
      <section className="bg-white border-b-2 border-[#e8d5b7] px-8 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
          {['All', 'Labrador Retriever', 'Poodle', 'German Shepherd'].map((breed) => (
            <button
              key={breed}
              onClick={() => { setSelectedBreed(breed); setExpanded(false) }}
              className={`px-5 py-2 rounded-full font-black text-sm border-2 transition-colors ${
                selectedBreed === breed
                  ? 'bg-[#5c3d1e] text-white border-[#5c3d1e]'
                  : 'border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'
              }`}
            >
              {breed}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 py-8 flex gap-8">
        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">

          {/* ── Sticky Filter + Sort Bar ── */}
          <div className="sticky top-[65px] z-30 bg-[#fdf6ee] pb-4 pt-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[#5c3d1e] font-black text-sm">Filter:</span>
              {['All', 'Female', 'Male'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
                    selectedGender === gender
                      ? 'bg-[#5c3d1e] text-white border-[#5c3d1e]'
                      : 'border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'
                  }`}
                >
                  {gender === 'All' ? 'All' : gender}
                </button>
              ))}
              <button
                onClick={() => setReadyNow(!readyNow)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
                  readyNow
                    ? 'bg-[#5c3d1e] text-white border-[#5c3d1e]'
                    : 'border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'
                }`}
              >
                Ready to go home
              </button>

              {/* Sort dropdown */}
              <div className="ml-auto relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="px-4 py-2 rounded-full text-sm font-bold border-2 border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850] flex items-center gap-2 transition-colors"
                >
                  Sort: {sortLabels[sortBy]}
                  <span className="text-xs">▾</span>
                </button>
                {showSort && (
                  <div className="absolute right-0 top-11 bg-white border-2 border-[#e8d5b7] rounded-2xl shadow-xl z-50 w-52 overflow-hidden">
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortBy(key); setShowSort(false) }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-[#fdf6ee] transition-colors ${
                          sortBy === key ? 'text-[#5c3d1e] bg-[#fdf6ee]' : 'text-[#a07850]'
                        }`}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[#a07850] font-bold text-sm">{filtered.length} puppies available</span>
            </div>
          </div>

          {/* ── Puppies Grid ── */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#a07850] text-xl font-bold">Loading puppies...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🐾</p>
              <p className="text-[#5c3d1e] text-xl font-black mb-2">No puppies found</p>
              <p className="text-[#a07850]">Try adjusting your filters or contact us directly</p>
              <Link href="/contact" className="inline-block mt-6 bg-[#5c3d1e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#a07850] transition-colors">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {filtered.map((puppy) => (
                <Link href={`/puppies/${puppy.id}`} key={puppy.id}
                  className="bg-white rounded-2xl overflow-hidden border-2 border-[#e8d5b7] hover:shadow-xl hover:border-[#a07850] transition-all group">
                  {/* Portrait-style image — taller aspect ratio like PuppySpot */}
                  <div className="aspect-[3/4] bg-[#e8d5b7] overflow-hidden relative">
                    {puppy.images?.[0] ? (
                      <Image
                        src={puppy.images[0]}
                        alt={puppy.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
                    )}
                    {puppy.is_champion_bloodline && (
                      <span className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">
                        ⭐ Champion bloodline
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-black text-[#5c3d1e]">{puppy.name}</h3>
                    <p className="text-[#a07850] text-sm">{puppy.breed}</p>
                    <p className="text-gray-500 text-sm">{puppy.gender} · {puppy.age_weeks} weeks</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(puppy.ready_date) <= new Date()
                        ? '✅ Ready to go home'
                        : `Ready by ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </p>
                    {/* Price intentionally hidden on card — shown on detail page (PuppySpot pattern) */}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Sidebar — About Breed ── */}
        {activeBreed && (
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-3xl border-2 border-[#e8d5b7] overflow-hidden sticky top-[80px]">
              <div className="relative h-48">
                <Image
                  src={breedImages[selectedBreed] || '/labrador.jpg'}
                  alt={selectedBreed}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-black text-[#a07850] uppercase mb-3">About breed</p>
                <h3 className="text-lg font-black text-[#5c3d1e] mb-4">Quick facts about {selectedBreed}s</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs text-[#a07850] font-bold uppercase">Temperament</p>
                    <p className="text-sm font-bold text-[#5c3d1e]">{activeBreed.temperament}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a07850] font-bold uppercase">Energy</p>
                    <p className="text-sm font-bold text-[#5c3d1e]">{activeBreed.energy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a07850] font-bold uppercase">Breed Group</p>
                    <p className="text-sm font-bold text-[#5c3d1e]">{activeBreed.group}</p>
                  </div>

                  {/* "Also part of" collections */}
                  {activeBreed.collections.length > 0 && (
                    <div>
                      <p className="text-xs text-[#a07850] font-bold uppercase mb-2">Also part of</p>
                      <div className="flex flex-col gap-1">
                        {activeBreed.collections.map((col) => (
                          <Link
                            key={col}
                            href={`/collections/${col.toLowerCase().replace(/ /g, '-')}`}
                            className="text-sm font-bold text-[#5c3d1e] hover:text-[#a07850] underline underline-offset-2 transition-colors"
                          >
                            {col}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Learn more CTA */}
                <Link
                  href={activeBreed.learnMoreHref}
                  className="mt-5 block text-center border-2 border-[#5c3d1e] text-[#5c3d1e] font-black text-sm px-4 py-2 rounded-full hover:bg-[#5c3d1e] hover:text-white transition-colors"
                >
                  Learn more about {selectedBreed}s
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Photo Reviews Section ── */}
<section className="bg-white px-8 py-16">
  <div className="max-w-6xl mx-auto">
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-3xl font-black text-[#5c3d1e]">Happy Puppy Parents</h2>
      {/* Trust badge — static, no link */}
      <div className="flex items-center gap-3 bg-[#fdf6ee] border-2 border-[#e8d5b7] rounded-full px-5 py-2">
        <div className="flex items-center gap-0.5">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[#00b67a] text-lg">★</span>
          ))}
          <span className="text-[#00b67a] text-lg">☆</span>
        </div>
        <div>
          <p className="text-xs font-black text-[#5c3d1e]">4.8 out of 5</p>
          <p className="text-xs text-[#a07850]">Trustpilot</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-6">
      {PHOTO_REVIEWS.map((review) => (
        <div key={review.name} className="bg-[#fdf6ee] rounded-3xl overflow-hidden border-2 border-[#e8d5b7]">
          {/* Puppy photo */}
          <div className="aspect-[4/3] bg-[#e8d5b7] relative overflow-hidden">
            {review.image ? (
              <Image
                src={review.image}
                alt={`${review.name}'s puppy`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e8d5b7] to-[#c8a87a]">
                <span className="text-6xl">🐶</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(review.stars)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-base">★</span>
              ))}
            </div>
            <p className="text-[#5c3d1e] mb-4 italic text-sm">"{review.review}"</p>
            <p className="font-black text-[#5c3d1e] text-sm">{review.name}</p>
            <p className="text-[#a07850] text-xs">{review.location} · {review.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── Footer ── */}
      <footer className="bg-[#3a2410] text-white px-8 pt-12 pb-6">
        <div className="max-w-6xl mx-auto">

          {/* Footer columns */}
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
              {/* Phone / concierge CTA */}
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
