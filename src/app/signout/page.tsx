"use client"

import { signOut } from "next-auth/react"
import { LogOut, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-brand-border bg-brand-panel p-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="GitGivers Logo" width={32} height={32} className="object-contain" />
            <span className="text-sm font-semibold text-brand-text hidden sm:inline">GitGivers</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Sign out
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Are you sure you want to sign out?
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#da3633] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#da3633]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#da3633] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
                <LogOut className="h-5 w-5" />
            )}
            {isLoading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  )
}
