"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mountain, Mail, Phone, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Have questions about sustainable travel or need help planning your next eco-adventure? We're here to help.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <Input placeholder="Your first name" className="border-gray-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <Input placeholder="Your last name" className="border-gray-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input type="email" placeholder="your.email@example.com" className="border-gray-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <Input placeholder="What's this about?" className="border-gray-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        className="border-gray-300 min-h-[120px]"
                      />
                    </div>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">hello@trailmate.com</p>
                    <p className="text-gray-600">support@trailmate.com</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600 text-sm">Mon-Fri, 9am-6pm PST</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      Visit Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">123 Adventure Street</p>
                    <p className="text-gray-600">Mountain View, CA 94041</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src="/images/autumn-hunza.jpg"
                    alt="Our office location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
