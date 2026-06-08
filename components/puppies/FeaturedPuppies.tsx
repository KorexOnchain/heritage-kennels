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
  is_champion_bloodline: boolean
}

export default function FeaturedPuppies() {
  const [puppies, setPuppies] = useState<Puppy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPuppies() {
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) console.error(error)
      else setPuppies(data || [])
      setLoading(false)
    }
    fetchPuppies()
  }, [])

  if (loading || puppies.length === 0) return null

  return (
    <section className="px-4 sm:px-8 py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header row — stacks on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-black text-[#a07850] uppercase tracking-widest mb-2">Available Now</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#5c3d1e]">Featured Puppies</h2>
          </div>
          <Link
            href="/puppies"
            className="self-start sm:self-auto border-2 border-[#5c3d1e] text-[#5c3d1e] px-6 py-2 rounded-full font-black hover:bg-[#5c3d1e] hover:text-white transition-colors text-sm sm:text-base"
          >
            View All Puppies →
          </Link>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {puppies.map((puppy) => (
            <Link
              href={`/puppies/${puppy.id}`}
              key={puppy.id}
              className="bg-[#fdf6ee] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#e8d5b7] hover:shadow-xl hover:border-[#a07850] transition-all group"
            >
              <div className="aspect-[3/4] bg-[#e8d5b7] overflow-hidden relative">
                {puppy.images?.[0] ? (
                  <Image
                    src={puppy.images[0]}
                    alt={puppy.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl">🐾</div>
                )}
                {puppy.is_champion_bloodline && (
                  <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-yellow-400 text-yellow-900 text-xs font-black px-2 sm:px-3 py-1 rounded-full">
                    ⭐ <span className="hidden sm:inline">Champion bloodline</span><span className="sm:hidden">Champion</span>
                  </span>
                )}
                <span className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-xs font-black px-2 sm:px-3 py-1 rounded-full ${
                  puppy.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {puppy.gender}
                </span>
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="text-base sm:text-lg font-black text-[#5c3d1e] truncate">{puppy.name}</h3>
                <p className="text-[#a07850] text-xs sm:text-sm truncate">{puppy.breed}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{puppy.age_weeks} weeks old</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(puppy.ready_date) <= new Date()
                    ? '✅ Ready to go home'
                    : `Ready ${new Date(puppy.ready_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </p>
                <p className="text-[#5c3d1e] font-black mt-1 sm:mt-2 text-sm sm:text-base">
                  ${puppy.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
