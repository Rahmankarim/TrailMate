"use client"
import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import Footer from "./footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide navbar and footer on admin dashboard, company dashboard, guide dashboard and admin management pages
  const isAdminPage = pathname?.startsWith("/dashboard/admin") || pathname?.startsWith("/admin/")
  const isDashboardPage = pathname?.startsWith("/dashboard/company") || pathname?.startsWith("/dashboard/guide") || pathname?.startsWith("/dashboard/user")
  
  if (isAdminPage || isDashboardPage) {
    return <>{children}</>
  }
  
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
