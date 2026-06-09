'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactPage() {
  const router = useRouter()

  useEffect(() => {
    window.location.href = 'https://www.facebook.com/share/1B8NFWF5Nt/?mibextid=wwXIfr'
  }, [])

  return (
    <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
      <p className="text-[#a07850] font-bold text-lg">Redirecting you to Facebook...</p>
    </div>
  )
}