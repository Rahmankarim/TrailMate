import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "TrailMate - Your AI Adventure Partner",
  description:
    "Connect with eco-conscious adventurers and discover sustainable travel experiences with AI-powered companion matching.",
  generator: "Rahman Karim",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-sans: ${dmSans.variable};
  --font-serif: ${dmSans.variable};
}
        `}</style>
      </head>
  <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
