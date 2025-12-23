import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { LogOut, AlertOctagon, Home, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function SessionErrorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-2xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-500">
                    <AlertOctagon className="h-4 w-4" />
                    <span>Session Data Mismatch</span>
                </div>
                
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    Something went wrong <br/> with your session.
                </h1>
                
                <p className="mx-auto lg:mx-0 max-w-xl text-lg text-muted-foreground leading-relaxed">
                     We detected an inconsistency between your browser session and our database. This is a security measure to protect your account. Please sign out and log in again to sync your data.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                <Link 
                    href="/signout"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    Securely Sign Out
                </Link>
                
                <Link
                    href="/"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-background px-8 py-4 text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                    <Home className="h-5 w-5" />
                    Return Home
                </Link>
            </div>

            <div className="border-t border-border/50 pt-8">
                 <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                    <Link href="https://github.com/rikutoyamada01/git-givers/issues" target="_blank" className="hover:text-foreground flex items-center gap-1 transition-colors">
                        <HelpCircle className="h-4 w-4" />
                        Report a Bug
                    </Link>
                    <span>•</span>
                    <span className="font-mono text-xs opacity-70">ERR_ZOMBIE_SESSION_404</span>
                 </div>
            </div>
        </div>
      </main>

      <Footer />

      {/* Decorative Elements */}
      <div className="fixed top-1/2 right-0 -z-10 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  )
}
