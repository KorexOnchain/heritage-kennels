'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const ADMIN_PASSWORD = 'heritage2026'

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

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [puppies, setPuppies] = useState<Puppy[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState('')
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add')
  const [form, setForm] = useState({
    name: '',
    breed: 'Labrador Retriever',
    gender: 'Male',
    age_weeks: '',
    price: '',
    ready_date: '',
    description: '',
    is_champion_bloodline: false,
  })

  useEffect(() => {
    if (authenticated) fetchPuppies()
  }, [authenticated])

  async function fetchPuppies() {
    const { data, error } = await supabase
      .from('puppies')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setPuppies(data || [])
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert('Wrong password!')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value
    setForm({ ...form, [target.name]: value })
  }

  async function uploadImages(): Promise<string[]> {
    const urls: string[] = []
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      setUploadProgress(`Uploading image ${i + 1} of ${imageFiles.length}...`)
      const fileName = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('puppy-images').upload(fileName, file)
      if (error) { alert('Image upload failed: ' + error.message); return [] }
      const { data } = supabase.storage.from('puppy-images').getPublicUrl(fileName)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function uploadVideo(): Promise<string> {
    if (!videoFile) return ''
    setUploadProgress('Uploading video...')
    const fileName = `${Date.now()}-${videoFile.name}`
    const { error } = await supabase.storage.from('puppy-images').upload(fileName, videoFile)
    if (error) { alert('Video upload failed: ' + error.message); return '' }
    const { data } = supabase.storage.from('puppy-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  async function handleSubmit() {
    if (!form.name || !form.price || !form.age_weeks || !form.ready_date) {
      alert('Please fill in all required fields')
      return
    }
    setLoading(true)
    setUploadProgress('Starting upload...')
    const imageUrls = await uploadImages()
    const videoUrl = await uploadVideo()
    setUploadProgress('Saving puppy listing...')
    const { error } = await supabase.from('puppies').insert({
      name: form.name,
      breed: form.breed,
      gender: form.gender,
      age_weeks: Number(form.age_weeks),
      price: Number(form.price),
      ready_date: form.ready_date,
      description: form.description,
      is_champion_bloodline: form.is_champion_bloodline,
      is_available: true,
      images: imageUrls,
      video_url: videoUrl,
    })
    setLoading(false)
    setUploadProgress('')
    if (error) {
      alert('Error adding puppy: ' + error.message)
    } else {
      setSuccess(true)
      setImageFiles([])
      setVideoFile(null)
      setForm({
        name: '',
        breed: 'Labrador Retriever',
        gender: 'Male',
        age_weeks: '',
        price: '',
        ready_date: '',
        description: '',
        is_champion_bloodline: false,
      })
      fetchPuppies()
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  async function markAsSold(id: string) {
    const { error } = await supabase
      .from('puppies')
      .update({ is_available: false })
      .eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchPuppies()
  }

  async function markAsAvailable(id: string) {
    const { error } = await supabase
      .from('puppies')
      .update({ is_available: true })
      .eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchPuppies()
  }

  async function deletePuppy(id: string) {
    const confirm = window.confirm('Are you sure you want to delete this puppy listing?')
    if (!confirm) return
    const { error } = await supabase.from('puppies').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchPuppies()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
        <div className="bg-white rounded-3xl border-2 border-[#e8d5b7] p-10 w-full max-w-sm text-center">
          <p className="text-4xl mb-4">🐾</p>
          <h1 className="text-2xl font-black text-[#5c3d1e] mb-2">Admin Access</h1>
          <p className="text-[#a07850] text-sm mb-6">Heritage Kennels Admin Panel</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border-2 border-[#e8d5b7] rounded-full px-4 py-3 text-center font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850] mb-4"
          />
          <button onClick={handleLogin} className="w-full bg-[#5c3d1e] text-white py-3 rounded-full font-black hover:bg-[#a07850] transition-colors">
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#fdf6ee] px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#5c3d1e]">Admin Panel</h1>
          <p className="text-[#a07850]">Heritage Kennels — Manage your puppy listings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 rounded-full font-black transition-colors ${activeTab === 'add' ? 'bg-[#5c3d1e] text-white' : 'border-2 border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'}`}
          >
            Add Puppy
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-full font-black transition-colors ${activeTab === 'manage' ? 'bg-[#5c3d1e] text-white' : 'border-2 border-[#e8d5b7] text-[#5c3d1e] hover:border-[#a07850]'}`}
          >
            Manage Listings ({puppies.length})
          </button>
        </div>

        {/* Add Puppy Tab */}
        {activeTab === 'add' && (
          <div>
            {success && (
              <div className="bg-green-100 border-2 border-green-400 text-green-800 font-bold px-6 py-4 rounded-2xl mb-6">
                ✅ Puppy added successfully!
              </div>
            )}
            <div className="bg-white rounded-3xl border-2 border-[#e8d5b7] p-8 flex flex-col gap-5">
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Puppy Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Max"
                  className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850]" />
              </div>
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Breed *</label>
                <select name="breed" value={form.breed} onChange={handleChange}
                  className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850]">
                  <option>Labrador Retriever</option>
                  <option>Poodle</option>
                  <option>German Shepherd</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850]">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Age (weeks) *</label>
                  <input name="age_weeks" type="number" value={form.age_weeks} onChange={handleChange} placeholder="e.g. 8"
                    className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850]" />
                </div>
                <div>
                  <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Price ($) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 1500"
                    className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Ready Date *</label>
                <input name="ready_date" type="date" value={form.ready_date} onChange={handleChange}
                  className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850]" />
              </div>
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Tell buyers about this puppy..." rows={4}
                  className="w-full border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 font-bold text-[#5c3d1e] focus:outline-none focus:border-[#a07850] resize-none" />
              </div>
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Photos (up to 5)</label>
                <input type="file" accept="image/*" multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []).slice(0, 5))}
                  className="w-full border-2 border-dashed border-[#e8d5b7] rounded-2xl px-4 py-4 text-[#a07850] font-bold" />
                {imageFiles.length > 0 && (
                  <p className="text-sm text-[#5c3d1e] font-bold mt-2">{imageFiles.length} photo(s) selected</p>
                )}
              </div>
              <div>
                <label className="text-xs font-black text-[#a07850] uppercase mb-2 block">Video (optional)</label>
                <input type="file" accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full border-2 border-dashed border-[#e8d5b7] rounded-2xl px-4 py-4 text-[#a07850] font-bold" />
                {videoFile && (
                  <p className="text-sm text-[#5c3d1e] font-bold mt-2">{videoFile.name} selected</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="is_champion_bloodline" id="champion"
                  checked={form.is_champion_bloodline} onChange={handleChange}
                  className="w-5 h-5 accent-[#5c3d1e]" />
                <label htmlFor="champion" className="font-black text-[#5c3d1e]">Champion Bloodline</label>
              </div>
              {uploadProgress && (
                <div className="bg-[#fdf6ee] border-2 border-[#e8d5b7] rounded-2xl px-4 py-3 text-[#5c3d1e] font-bold text-sm">
                  ⏳ {uploadProgress}
                </div>
              )}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-[#5c3d1e] text-white py-4 rounded-full font-black text-lg hover:bg-[#a07850] transition-colors disabled:opacity-50">
                {loading ? 'Adding Puppy...' : 'Add Puppy Listing'}
              </button>
            </div>
          </div>
        )}

        {/* Manage Listings Tab */}
        {activeTab === 'manage' && (
          <div className="flex flex-col gap-4">
            {puppies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🐾</p>
                <p className="text-[#5c3d1e] font-black text-xl">No listings yet</p>
                <p className="text-[#a07850]">Add your first puppy to get started</p>
              </div>
            ) : (
              puppies.map((puppy) => (
                <div key={puppy.id} className="bg-white rounded-3xl border-2 border-[#e8d5b7] p-6 flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#e8d5b7] shrink-0">
                    {puppy.images?.[0] ? (
                      <Image src={puppy.images[0]} alt={puppy.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-[#5c3d1e]">{puppy.name}</h3>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${puppy.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {puppy.is_available ? 'Available' : 'Sold'}
                      </span>
                      {puppy.is_champion_bloodline && (
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">⭐ Champion</span>
                      )}
                    </div>
                    <p className="text-[#a07850] text-sm">{puppy.breed} • {puppy.gender} • {puppy.age_weeks} weeks</p>
                    <p className="text-[#5c3d1e] font-black">${puppy.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {puppy.is_available ? (
                      <button onClick={() => markAsSold(puppy.id)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-full font-black text-sm hover:bg-orange-600 transition-colors">
                        Mark as Sold
                      </button>
                    ) : (
                      <button onClick={() => markAsAvailable(puppy.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-full font-black text-sm hover:bg-green-700 transition-colors">
                        Mark as Available
                      </button>
                    )}
                    <button onClick={() => deletePuppy(puppy.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full font-black text-sm hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}