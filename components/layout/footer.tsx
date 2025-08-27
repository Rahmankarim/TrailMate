import { Mountain } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-6 w-6 text-gray-900" />
              <span className="text-xl font-bold text-gray-900">TrailMate</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Connecting eco-conscious adventurers for sustainable travel experiences worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Companion Matching</li>
              <li>Guide Finder</li>
              <li>Secure Booking</li>
              <li>Eco Lodging</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/destinations" className="hover:text-gray-900 transition-colors">
                  Hunza Valley
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-gray-900 transition-colors">
                  Skardu Lakes
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-gray-900 transition-colors">
                  Karakoram Range
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-gray-900 transition-colors">
                  Attabad Lake
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <p>&copy; 2024 TrailMate. All rights reserved. Built with sustainability in mind.</p>
        </div>
      </div>
    </footer>
  )
}
