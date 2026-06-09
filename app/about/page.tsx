'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const TEAM = [
    {
        name: 'John Smith',
        title: 'Head Breeder',
        bio: 'John has been raising dogs on the Heritage Kennels farm for over 15 years. His passion for healthy, happy puppies is the heart of everything we do.',
        image: '/team/john.jpg',
    },
    {
        name: 'Sarah Johnson',
        title: 'Kennel Manager',
        bio: 'I first got introduced to PuppySpot as a customer, acquiring two delightful yorkies, Rowdy and Mr. King. I joined as our Controller in 2019. I live in Nutley, New Jersey with my family.',
        image: '/team/sarah.jpg',
    },
    {
        name: 'Mike Davis',
        title: 'Puppy Care Specialist',
        bio: "Like a number of my teammates, I've been with Heritage Kennels for over a decade. Because who wouldn't want to work for a company that's all about delivering unconditional love?",
        image: '/team/mike.jpg',
    },
]

export default function AboutPage() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <main className="min-h-screen bg-[#fdf6ee]">



            {/* ── Navbar ── */}
            <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-[#fdf6ee] shadow-sm sticky top-0 z-40">
                <Link href="/">
                    <div>
                        <p className="text-xl sm:text-2xl font-black text-[#5c3d1e]">Heritage Kennels</p>
                        <p className="text-xs text-[#a07850]">The Farmer's Dog</p>
                    </div>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/puppies" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">Available Puppies</Link>
                    <Link href="/about" className="text-[#5c3d1e] hover:text-[#a07850] font-semibold">About Us</Link>
                    <Link href="/puppies" className="bg-[#5c3d1e] text-white px-5 py-2 rounded-full font-bold hover:bg-[#a07850] transition-colors">
                        Find Your Puppy
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-[#5c3d1e] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-[#5c3d1e] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-[#5c3d1e] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </nav>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-b-2 border-[#e8d5b7] px-6 py-4 flex flex-col gap-4 z-30">
                    <Link href="/puppies" className="text-[#5c3d1e] font-semibold py-2 border-b border-[#e8d5b7]" onClick={() => setMenuOpen(false)}>Available Puppies</Link>
                    <Link href="/about" className="text-[#5c3d1e] font-semibold py-2 border-b border-[#e8d5b7]" onClick={() => setMenuOpen(false)}>About Us</Link>
                    <Link href="/puppies" className="bg-[#5c3d1e] text-white px-5 py-3 rounded-full font-bold text-center hover:bg-[#a07850] transition-colors" onClick={() => setMenuOpen(false)}>
                        Find Your Puppy
                    </Link>
                </div>
            )}

            {/* ── Hero ── */}
            <section className="bg-[#5c3d1e] text-white text-center py-16 sm:py-24 px-6 sm:px-8 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto">
                    <p className="text-xs font-black text-[#e8d5b7] uppercase tracking-widest mb-4">Our Mission</p>
                    <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
                        To help families find their perfect puppy and the love that comes with it
                    </h1>
                    <p className="text-[#e8d5b7] text-base sm:text-lg leading-relaxed">
                        Heritage Kennels is a family-run kennel based in Dallas, Texas. We raise Labrador Retrievers,
                        Poodles, and German Shepherds with love, care, and the highest standards of health and wellbeing.
                    </p>
                </div>
            </section>

            {/* ── About section ── */}
            <section className="max-w-5xl mx-auto px-6 sm:px-8 py-14 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                    <p className="text-xs font-black text-[#a07850] uppercase tracking-widest mb-3">About Heritage Kennels</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#5c3d1e] mb-6">Raised on our farm, loved from day one</h2>
                    <p className="text-[#5c3d1e] leading-relaxed mb-4">
                        We are a community of dog lovers committed to raising healthy, happy puppies and connecting them
                        with caring families across America. Every puppy born at Heritage Kennels is raised on our family
                        farm in Dallas, Texas — never in a cage, always with love.
                    </p>
                    <p className="text-[#5c3d1e] leading-relaxed mb-4">
                        We specialize in three of the most beloved breeds in America — Labrador Retrievers, Poodles, and
                        German Shepherds. Each puppy is vet-checked, vaccinated, and given the best possible start in life
                        before joining your family.
                    </p>
                    <p className="text-[#5c3d1e] leading-relaxed">
                        We offer nationwide delivery and local pickup, and we stay with you every step of the way — from
                        the moment you find your puppy to the day they come home.
                    </p>
                </div>
                <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#e8d5b7]">
                    <Image src="/labrador.jpg" alt="Heritage Kennels Farm" fill className="object-cover" />
                </div>
            </section>

            {/* ── Video section ── */}
            <section className="bg-[#5c3d1e] px-6 sm:px-8 py-14 sm:py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs font-black text-[#e8d5b7] uppercase tracking-widest mb-3">Real life-changing experiences</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 sm:mb-10">See our puppies in action</h2>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full rounded-2xl sm:rounded-3xl"
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>

            {/* ── Our Promise ── */}
            <section className="max-w-5xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
                <p className="text-xs font-black text-[#a07850] uppercase tracking-widest mb-3 text-center">Our Promise</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#5c3d1e] mb-10 sm:mb-12 text-center">What sets Heritage Kennels apart</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                    {[
                        { icon: '❤️', title: 'Raised with Love', desc: 'Every puppy is hand raised on our family farm in Dallas, Texas from birth.' },
                        { icon: '🏥', title: 'Health Guaranteed', desc: 'Full vet check, vaccinations, and health records provided with every puppy.' },
                        { icon: '🚚', title: 'Nationwide Delivery', desc: 'Safe, climate-controlled delivery straight to your door anywhere in the US.' },
                        { icon: '📞', title: 'Lifetime Support', desc: 'We are always here for you and your pup — before and after they come home.' },
                        { icon: '🐾', title: 'Top Breeds Only', desc: 'We focus on three of the most loved breeds — Labs, Poodles, and German Shepherds.' },
                        { icon: '🌾', title: 'Farm Raised', desc: 'Our puppies grow up on open land, not in cages. Happy puppies make happy families.' },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-3xl border-2 border-[#e8d5b7] p-6 text-center">
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="font-black text-[#5c3d1e] mb-2">{item.title}</h3>
                            <p className="text-[#a07850] text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Team section ── */}
            <section className="bg-white px-6 sm:px-8 py-14 sm:py-20">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-black text-[#a07850] uppercase tracking-widest mb-3 text-center">The Team</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#5c3d1e] mb-3 text-center">The people behind Heritage Kennels</h2>
                    <p className="text-[#a07850] text-center mb-10 sm:mb-12 text-sm sm:text-base">Meet the passionate dog lovers who raise and care for every puppy on our farm</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                        {TEAM.map((member) => (
                            <div key={member.name} className="text-center">
                                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#e8d5b7] mx-auto mb-4 border-4 border-[#fdf6ee]">
                                    {member.image ? (
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-[#5c3d1e]">{member.name}</h3>
                                <p className="text-[#a07850] text-sm font-bold mb-3">{member.title}</p>
                                <p className="text-[#5c3d1e] text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[#e8d5b7] px-6 sm:px-8 py-14 sm:py-20 text-center">
                <h2 className="text-3xl sm:text-4xl font-black text-[#5c3d1e] mb-4">Ready to find your perfect puppy?</h2>
                <p className="text-[#a07850] text-base sm:text-lg mb-8">Browse our available puppies or reach out to us directly on Facebook</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/puppies" className="bg-[#5c3d1e] text-white px-8 py-3 rounded-full text-lg font-black hover:bg-[#a07850] transition-colors">
                        Browse Puppies
                    </Link>
                    <a href="https://www.facebook.com/share/1B8NFWF5Nt/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] text-white px-8 py-3 rounded-full text-lg font-black hover:opacity-90 transition-opacity">
                        📘 Message us on Facebook
                    </a>
                    <a href="https://wa.me/17025461964" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-3 rounded-full text-lg font-black hover:opacity-90 transition-opacity">
                        💬 WhatsApp Us
                    </a>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#3a2410] text-white px-6 sm:px-8 pt-12 pb-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 text-sm">
                        <div>
                            <p className="text-2xl font-black mb-1">Heritage Kennels</p>
                            <p className="text-[#a07850] text-xs mb-4">The Farmer's Dog — Dallas, Texas</p>
                            <p className="text-[#e8d5b7]/70 text-xs leading-relaxed">Raising healthy, happy puppies on our family farm since 2010.</p>
                        </div>
                        <div>
                            <p className="text-xs font-black text-[#a07850] uppercase mb-3">Explore</p>
                            <div className="flex flex-col gap-2 text-[#e8d5b7]">
                                <Link href="/puppies" className="hover:text-white">Available Puppies</Link>
                                <Link href="/about" className="hover:text-white">About Us</Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-black text-[#a07850] uppercase mb-3">Follow Us</p>
                            <a
                                href="https://www.facebook.com/share/1B8NFWF5Nt/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e8d5b7] hover:text-white font-bold text-sm block mb-2"
                            >
                                📘 Facebook
                            </a>

                        </div>
                    </div>
                    <hr className="border-[#5c3d1e] mb-4" />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#a07850]">
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
