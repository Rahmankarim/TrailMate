import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto py-24 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">My Profile</h1>
        <p className="text-lg text-gray-600 mb-8">View and manage your TrailMate account, trips, and preferences.</p>
        {/* Add profile UI here */}
      </main>
    </div>
  )
}
