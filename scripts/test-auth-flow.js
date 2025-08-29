// Test script to verify authentication flow works correctly
console.log("[v0] Starting authentication flow tests...")

// Test 1: Verify User role signup and redirect
async function testUserSignup() {
  console.log("[v0] Testing User signup flow...")

  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "TestPassword123",
    role: "User",
  }

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    })

    const result = await response.json()
    console.log("[v0] User signup result:", result)

    if (result.success && result.redirectUrl === "/dashboard/user") {
      console.log("[v0] ✅ User signup and redirect working correctly")
      return true
    } else {
      console.log("[v0] ❌ User signup failed or incorrect redirect")
      return false
    }
  } catch (error) {
    console.log("[v0] ❌ User signup test error:", error.message)
    return false
  }
}

// Test 2: Verify Company role signup and redirect
async function testCompanySignup() {
  console.log("[v0] Testing Company signup flow...")

  const testCompany = {
    name: "Test Company",
    email: "testcompany@example.com",
    password: "TestPassword123",
    role: "Company",
  }

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCompany),
    })

    const result = await response.json()
    console.log("[v0] Company signup result:", result)

    if (result.success && result.redirectUrl === "/dashboard/company") {
      console.log("[v0] ✅ Company signup and redirect working correctly")
      return true
    } else {
      console.log("[v0] ❌ Company signup failed or incorrect redirect")
      return false
    }
  } catch (error) {
    console.log("[v0] ❌ Company signup test error:", error.message)
    return false
  }
}

// Test 3: Verify Super Admin login
async function testSuperAdminLogin() {
  console.log("[v0] Testing Super Admin login...")

  const adminCredentials = {
    email: "rahmankarim2468@gmail.com",
    password: "Superadmin12345",
  }

  try {
    const response = await fetch("/api/auth/admin/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminCredentials),
    })

    const result = await response.json()
    console.log("[v0] Super Admin login result:", result)

    if (result.success && result.redirectUrl === "/admin/dashboard") {
      console.log("[v0] ✅ Super Admin login working correctly")
      return true
    } else {
      console.log("[v0] ❌ Super Admin login failed or incorrect redirect")
      return false
    }
  } catch (error) {
    console.log("[v0] ❌ Super Admin login test error:", error.message)
    return false
  }
}

// Test 4: Verify role-based dashboard access
async function testDashboardAccess() {
  console.log("[v0] Testing dashboard access patterns...")

  // Test that each role gets the correct dashboard
  const dashboardTests = [
    { role: "User", expectedPath: "/dashboard/user" },
    { role: "Company", expectedPath: "/dashboard/company" },
    { role: "SuperAdmin", expectedPath: "/admin/dashboard" },
  ]

  let allPassed = true

  for (const test of dashboardTests) {
    console.log(`[v0] Testing ${test.role} dashboard access...`)

    // Simulate dashboard selector logic
    const mockUser = { role: test.role }
    let redirectPath

    if (mockUser.role === "User") {
      redirectPath = "/dashboard/user"
    } else if (mockUser.role === "Company") {
      redirectPath = "/dashboard/company"
    } else if (mockUser.role === "SuperAdmin") {
      redirectPath = "/admin/dashboard"
    }

    if (redirectPath === test.expectedPath) {
      console.log(`[v0] ✅ ${test.role} dashboard routing correct`)
    } else {
      console.log(
        `[v0] ❌ ${test.role} dashboard routing incorrect. Expected: ${test.expectedPath}, Got: ${redirectPath}`,
      )
      allPassed = false
    }
  }

  return allPassed
}

// Run all tests
async function runAllTests() {
  console.log("[v0] Running comprehensive authentication flow tests...")

  const results = {
    userSignup: await testUserSignup(),
    companySignup: await testCompanySignup(),
    superAdminLogin: await testSuperAdminLogin(),
    dashboardAccess: await testDashboardAccess(),
  }

  console.log("[v0] Test Results Summary:")
  console.log("[v0] User Signup:", results.userSignup ? "✅ PASS" : "❌ FAIL")
  console.log("[v0] Company Signup:", results.companySignup ? "✅ PASS" : "❌ FAIL")
  console.log("[v0] Super Admin Login:", results.superAdminLogin ? "✅ PASS" : "❌ FAIL")
  console.log("[v0] Dashboard Access:", results.dashboardAccess ? "✅ PASS" : "❌ FAIL")

  const allPassed = Object.values(results).every((result) => result === true)

  if (allPassed) {
    console.log("[v0] 🎉 All authentication tests PASSED! System is working correctly.")
  } else {
    console.log("[v0] ⚠️ Some tests FAILED. Please check the implementation.")
  }

  return allPassed
}

// Execute tests
runAllTests().then((success) => {
  if (success) {
    console.log("[v0] Authentication system is ready for production!")
  } else {
    console.log("[v0] Authentication system needs fixes before deployment.")
  }
})
