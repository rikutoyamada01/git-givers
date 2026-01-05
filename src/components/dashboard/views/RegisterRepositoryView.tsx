"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Book, Check, Loader, Plus, X, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"

import { REPOSITORY_REGISTRATION_COST } from "@/lib/karma"

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  private: boolean
  stargazers_count: number
}

interface RegisterRepositoryViewProps {
  onCancel: () => void
}


import { useUserKarma } from "@/hooks/useUserKarma"

// ... imports

export default function RegisterRepositoryView({ onCancel }: RegisterRepositoryViewProps) {
  const { data: session, status, update } = useSession()
  const { user, mutate: mutateUser } = useUserKarma() // Use SWR hook
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registering, setRegistering] = useState<number | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  
  // Derived state from SWR
  const userKarma = user?.karma || 0;

  // Manual fetch of User Karma REMOVED in favor of SWR


  // Fetch GitHub repos and Registered repos
  useEffect(() => {
    async function fetchRepos() {
      if (status === "authenticated") {
        setLoading(true)
        setError(null)
        try {
          const accessToken = session?.user?.accessToken;

          const [githubResponse, registeredResponse] = await Promise.all([
            fetch("https://api.github.com/user/repos?type=owner&sort=updated&per_page=100", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            fetch("/api/repositories")
          ]);

          if (!githubResponse.ok) {
            throw new Error("Failed to fetch repositories from GitHub")
          }
          if (!registeredResponse.ok) {
             console.warn("Failed to fetch registered repositories, skipping filter")
          }

          const githubData = await githubResponse.json()
          let filteredData = githubData;

          if (registeredResponse.ok) {
            const registeredData = await registeredResponse.json();
            const registeredIds = new Set(registeredData.map((r: { githubId: number }) => r.githubId));
            filteredData = githubData.filter((repo: GitHubRepo) => !registeredIds.has(repo.id));
          }

          setRepos(filteredData)
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
          setLoading(false)
        }
      } else if (status === "unauthenticated") {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [status, session])

  const handleRegister = async () => {
    if (!selectedRepo) return

    if (userKarma < REPOSITORY_REGISTRATION_COST) {
      toast.error(`Insufficient Karma. You need ${REPOSITORY_REGISTRATION_COST} Karma to register a repository.`)
      return
    }

    setRegistering(selectedRepo.id)
    try {
      const response = await fetch("/api/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubId: selectedRepo.id // Removed trailing comma
        }),
      })


      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          throw new Error("This repository is already registered.")
        }
        throw new Error(errorData.message || "Failed to register repository")
      }

      toast.success(`Successfully registered ${selectedRepo.full_name}!`)
      await update() // Update session
      await mutateUser() // Refresh SWR cache globally
      onCancel() // Go back to feed
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to register repository")
    } finally {
      setRegistering(null)
    }
  }

  if (status === "loading" || loading) {
    return <LoadingState text="Loading repositories..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border p-4 space-y-0">
        <CardTitle className="text-base font-bold text-brand-text">Register Repository</CardTitle>
        <button onClick={onCancel} className="text-brand-muted hover:text-brand-text">
          <X className="w-5 h-5" />
        </button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-center mb-8 text-sm">
          <div className={`flex items-center gap-2 ${selectedRepo ? 'text-brand-accent' : 'text-brand-text'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${selectedRepo ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border'}`}>1</div>
            <span>Select Repository</span>
          </div>
          <div className="w-8 h-px bg-[#30363d] mx-2"></div>
          <div className={`flex items-center gap-2 ${selectedRepo ? 'text-brand-text' : 'text-brand-muted'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${selectedRepo ? 'border-brand-border' : 'border-brand-border'}`}>2</div>
            <span>Confirm & Pay</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-brand-text">Select a Repository to Register</label>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {repos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className={`p-3 rounded-md border cursor-pointer flex items-center justify-between group transition-colors ${
                  selectedRepo?.id === repo.id
                    ? 'border-brand-accent bg-brand-accent/10'
                    : 'border-brand-border hover:border-brand-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Book className="w-4 h-4 text-brand-muted" />
                  <div>
                    <div className="text-brand-text font-medium">{repo.full_name}</div>
                    <div className="text-xs text-brand-muted truncate max-w-[300px]">{repo.description || "No description"}</div>
                  </div>
                  {repo.private && <span className="text-xs border border-brand-border px-1.5 rounded-full text-brand-muted">Private</span>}
                </div>
                {selectedRepo?.id === repo.id && <Check className="w-4 h-4 text-brand-accent" />}
              </div>
            ))}
          </div>
        </div>

        {selectedRepo && (
          <div className="mt-8 pt-6 border-t border-brand-border animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="bg-background rounded-md p-4 border border-brand-border mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-brand-muted">Registration Fee</span>
                    <span className="text-brand-text">{REPOSITORY_REGISTRATION_COST}</span>
                </div>
                <div className="border-t border-brand-border my-2"></div>
                <div className="flex justify-between font-bold">
                    <span className="text-brand-text">Total Cost</span>
                    <span className="text-[#e3b341] flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {REPOSITORY_REGISTRATION_COST}
                    </span>
                </div>
                <div className="text-xs text-right mt-2 text-brand-muted">
                  Your Balance: {userKarma} Karma
                </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="text-brand-muted hover:text-brand-text text-sm font-medium px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={!!registering || userKarma < REPOSITORY_REGISTRATION_COST}
                className="bg-brand-success hover:bg-brand-success/80 text-white px-6 py-2 rounded-md font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {registering === selectedRepo.id ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Pay {REPOSITORY_REGISTRATION_COST} Karma & Register
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
