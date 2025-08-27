import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function SOSPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto py-24 px-6 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Emergency SOS</h1>
        <p className="text-lg text-gray-700 mb-8">Get help instantly in case of emergency during your adventure.</p>
        {/* Add SOS functionality here */}
      </main>
    </div>
  )
}
