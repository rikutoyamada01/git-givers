import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    async signIn({ user, profile }) {
      if (!user?.id) return

      const usernameFromProfile =
        profile && typeof profile.login === "string"
          ? profile.login
          : undefined

      try {
        const existing = await prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true, image: true },
        })

        if (!existing) return

        const data: { name?: string; image?: string; username?: string } = {}

        // GitHub username は常に同期（GitGivers側では編集不可）
        if (typeof usernameFromProfile === "string") {
          data.username = usernameFromProfile
        }

        // name / image は GitGivers 側で未設定のときだけ GitHub から初期値を入れる
        if (!existing.name && profile && typeof profile.name === "string") {
          data.name = profile.name
        }

        if (!existing.image && profile && typeof profile.avatar_url === "string") {
          data.image = profile.avatar_url
        }

        await prisma.user.update({
          where: { id: user.id },
          data,
        })
      } catch (error) {
        console.error("[auth][events.signIn] failed to sync username", error)
      }
    },
  },
})
