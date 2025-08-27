"use client"
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const destination = searchParams.get('destination') || ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [seats, setSeats] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Mock submission — in a real app you'd POST to an API
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setSuccess(true)
    // optional: redirect after a short delay
    setTimeout(() => router.push('/destinations'), 1200)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card className="max-w-lg w-full p-6">
        <h1 className="text-2xl font-semibold mb-2">Book a seat</h1>
        <p className="text-sm text-gray-600 mb-4">Destination: <span className="font-medium">{destination || '—'}</span></p>

        {success ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded">Your seat is booked! Redirecting to destinations…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Seats</label>
              <input value={seats} onChange={(e) => setSeats(Number(e.target.value))} type="number" min={1} max={10} className="mt-1 w-24 rounded-md border px-3 py-2" />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" className="bg-emerald-600" disabled={loading}>{loading ? 'Booking…' : 'Confirm booking'}</Button>
              <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        )}
      </Card>
    </main>
  )
}
