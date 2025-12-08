import { signIn } from "@/lib/auth"
import { Github, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-brand-border bg-brand-panel p-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="GitGivers Logo" width={32} height={32} className="object-contain" />
            <span className="text-sm font-semibold text-brand-text hidden sm:inline">GitGivers</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Sign in to GitGivers
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Connect your GitHub account to get started
          </p>
        </div>
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/dashboard" })
          }}
          className="mt-8 space-y-6"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#24292F]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] transition-all"
          >
            <Github className="h-5 w-5" />
            Sign in with GitHub
          </button>
        </form>
      </div>
    </div>
  )
}
