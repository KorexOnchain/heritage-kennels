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

const PHOTO_REVIEWS = [
  {
    name: 'Sarah M.',
    location: 'Austin, TX',
    review: 'Our Labrador Max is the most loving dog. Heritage Kennels made the whole process so easy and stress free!',
    stars: 5,
    image: '/reviews/sarah-max.jpg',
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPuppies()
  }, [])

  async function fetchPuppies() {
    const { data, error } = await supabase
      .from('puppies')
      .select('*')
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
      if (sortBy === 'ready_soon') return new Date(a.ready_date).getTime() - new Date(b.ready_date).getTime()
      return 0
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

      {/* Navbar */}
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
          <Link href="/puppies" onClick={() => setMenuOpen(false)} className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold text-center">
            Find Your Puppy
          </Link>
        </div>
      )}

      {/* Breed Header */}
      <section className="bg-[#5c3d1e] text-white px-5 md:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-[#e8d5b7] mb-4 flex items-center gap-1 flex-wrap">
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
          <h1 className="text-3xl md:text-5xl font-black mb-2">
            {selectedBreed === 'All' ? 'Available Puppies' : `${selectedBreed} Puppies`}
          </h1>
          {activeBreed && (
            <p className="text-[#e8d5b7] text-base md:text-lg font-semibold mb-4">{activeBreed.traits}</p>
          )}
          {activeBreed && (
            <div className="max-w-2xl">
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                {expanded ? activeBreed.description : `${activeBreed.description.slice(0, 120)}...`}
                <button onClick={() => setExpanded(!expanded)} className="ml-2 text-[#e8d5b7] font-black underline">
                  {expanded ? 'Read less' : 'Read more'}
                </button>
              </p>
            </div>
          )}
          {selectedBreed === 'All' && (
            <p className="text-[#e8d5b7] text-sm md:text-base">Find your perfect companion from our farm in Dallas, Texas</p>
          )}
        </div>
      </section>

      {/* Breed Filter Tabs */}
      <section className="bg-white border-b-2 border-[#e8d5b7] px-5 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex gap-2 md:gap-3 flex-wrap">
          {['All', 'Labrador Retriever', 'Poodle', 'German Shepherd'].map((breed) => (
            <button
              key={breed}
              onClick={() => { setSelectedBreed(breed); setExpanded(false) }}
              className={`px-3 md:px-5 py-2 rounded-full font-black text-xs md:text-sm border-2 transition-colors ${selectedBreed === breed ? 'bg-[#5c3d1e] text-white border-[#5c3d1e]' : 'border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'}`}
            >
              {breed}
            </button>
          ))}
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 md:py-8 flex gap-8">

        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* Filter + Sort Bar */}
          <div className="sticky top-[65px] z-30 bg-[#fdf6ee] pb-3 pt-1">
            <div className="flex items-center gap-3 md:hidden mb-2">
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 rounded-full text-sm font-bold border-2 border-[#e8d5b7] text-[#5c3d1e]">
                {showFilters ? 'Hide Filters ▴' : 'Filters & Sort ▾'}
              </button>
              <span className="text-[#a07850] font-bold text-sm ml-auto">{filtered.length} puppies</span>
            </div>
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex items-center gap-2 md:gap-3 flex-wrap`}>
              <span className="text-[#5c3d1e] font-black text-sm hidden md:inline">Filter:</span>
              {['All', 'Female', 'Male'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-3 md:px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${selectedGender === gender ? 'bg-[#5c3d1e] text-white border-[#5c3d1e]' : 'border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'}`}
                >
                  {gender}
                </button>
              ))}
              <button
                onClick={() => setReadyNow(!readyNow)}
                className={`px-3 md:px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${readyNow ? 'bg-[#5c3d1e] text-white border-[#5c3d1e]' : 'border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'}`}
              >
                Ready now
              </button>
              <div className="md:ml-auto relative">
                <button onClick={() => setShowSort(!showSort)} className="px-3 md:px-4 py-2 rounded-full text-sm font-bold border-2 border-[#e8d5b7] text-[#5c3d1e] flex items-center gap-2">
                  Sort: {sortLabels[sortBy]} <span className="text-xs">▾</span>
                </button>
                {showSort && (
                  <div className="absolute right-0 top-11 bg-white border-2 border-[#e8d5b7] rounded-2xl shadow-xl z-50 w-52 overflow-hidden">
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button key={key} onClick={() => { setSortBy(key); setShowSort(false) }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-[#fdf6ee] transition-colors ${sortBy === key ? 'text-[#5c3d1e] bg-[#fdf6ee]' : 'text-[#a07850]'}`}>
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[#a07850] font-bold text-sm hidden md:inline">{filtered.length} puppies available</span>
            </div>
          </div>

          {/* Puppies Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#a07850] text-xl font-bold">Loading puppies...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🐾</p>
              <p className="text-[#5c3d1e] text-xl font-black mb-2">No puppies found</p>
              <p className="text-[#a07850]">Try adjusting your filters or contact us directly</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {filtered.map((puppy) => (
                <div key={puppy.id} className={`relative ${!puppy.is_available ? 'opacity-75' : ''}`}>
                  {!puppy.is_available ? (
                    <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#e8d5b7] cursor-not-allowed">
                      <div className="aspect-[3/4] bg-[#e8d5b7] overflow-hidden relative">
                        {puppy.images?.[0] ? (
                          <Image src={puppy.images[0]} alt={puppy.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-2xl font-black px-8 py-3 rounded-full rotate-[-15deg] shadow-lg">
                            SOLD
                          </span>
                        </div>
                      </div>
                      <div className="p-3 md:p-4">
                        <h3 className="text-base md:text-lg font-black text-[#5c3d1e]">{puppy.name}</h3>
                        <p className="text-[#a07850] text-xs md:text-sm">{puppy.breed}</p>
                        <p className="text-gray-500 text-xs md:text-sm">{puppy.gender} · {puppy.age_weeks}wks</p>
                      </div>
                    </div>
                  ) : (
                    <Link href={`/puppies/${puppy.id}`} className="bg-white rounded-2xl overflow-hidden border-2 border-[#e8d5b7] hover:shadow-xl hover:border-[#a07850] transition-all group block">
                      <div className="aspect-[3/4] bg-[#e8d5b7] overflow-hidden relative">
                        {puppy.images?.[0] ? (
                          <Image src={puppy.images[0]} alt={puppy.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
                        )}
                        {puppy.is_champion_bloodline && (
                          <span className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full">
                            ⭐ Champion
                          </span>
                        )}
                      </div>
                      <div className="p-3 md:p-4">
                        <h3 className="text-base md:text-lg font-black text-[#5c3d1e]">{puppy.name}</h3>
                        <p className="text-[#a07850] text-xs md:text-sm">{puppy.breed}</p>
                        <p className="text-gray-500 text-xs md:text-sm">{puppy.gender} · {puppy.age_weeks}wks</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(puppy.ready_date) <= new Date() ? '✅ Ready now' : `Ready ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {activeBreed && (
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-3xl border-2 border-[#e8d5b7] overflow-hidden sticky top-[80px]">
              <div className="relative h-48">
                <Image src={breedImages[selectedBreed] || '/labrador.jpg'} alt={selectedBreed} fill className="object-cover" />
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
                  {activeBreed.collections.length > 0 && (
                    <div>
                      <p className="text-xs text-[#a07850] font-bold uppercase mb-2">Also part of</p>
                      <div className="flex flex-col gap-1">
                        {activeBreed.collections.map((col) => (
                          <span key={col} className="text-sm font-bold text-[#5c3d1e]">{col}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Photo Reviews Section */}
      <section className="bg-white px-5 md:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#5c3d1e]">Happy Puppy Parents</h2>
            <div className="flex items-center gap-3 bg-[#fdf6ee] border-2 border-[#e8d5b7] rounded-full px-4 py-2 self-start sm:self-auto">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[#00b67a] text-base md:text-lg">★</span>
                ))}
                <span className="text-[#00b67a] text-base md:text-lg">☆</span>
              </div>
              <div>
                <p className="text-xs font-black text-[#5c3d1e]">4.8 out of 5</p>
                <p className="text-xs text-[#a07850]">Trustpilot</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {PHOTO_REVIEWS.map((review) => (
              <div key={review.name} className="bg-[#fdf6ee] rounded-3xl overflow-hidden border-2 border-[#e8d5b7]">
                <div className="aspect-[4/3] bg-[#e8d5b7] relative overflow-hidden">
                  {review.image ? (
                    <Image src={review.image} alt={`${review.name}'s puppy`} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e8d5b7] to-[#c8a87a]">
                      <span className="text-6xl">🐶</span>
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-6">
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

      {/* Footer */}
      <footer className="bg-[#3a2410] text-white px-5 md:px-8 pt-10 md:pt-12 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10 text-sm">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl md:text-2xl font-black mb-1">Heritage Kennels</p>
              <p className="text-[#a07850] text-xs mb-4">The Farmer's Dog — Dallas, Texas</p>
              <p className="text-[#e8d5b7]/70 text-xs leading-relaxed">Raising healthy, happy puppies on our family farm since 2010.</p>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">Explore</p>
              <div className="flex flex-col gap-2 text-[#e8d5b7]">
                <Link href="/puppies" className="hover:text-white transition-colors">Available Puppies</Link>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-[#a07850] uppercase mb-3">Contact Us</p>
              <div className="flex flex-col gap-2 text-[#e8d5b7]">
                <a href="https://www.facebook.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">📘 Facebook</a>
                <a href="https://wa.me/17025461964" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">💬 WhatsApp</a>
              </div>
            </div>
          </div>
          <hr className="border-[#5c3d1e] mb-4" />
          <p className="text-center text-xs text-[#a07850]">© 2026 Heritage Kennels. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}