# 🗺️ GitKarma Grand Roadmap

This document serves as the **Master Project Plan**. It tracks the long-term evolution of GitKarma, from its genesis to its ultimate form as a developer ecosystem.

**Legend:**
*   **Status:** ✅ Done | 🔄 In Progress | ⬜ Todo
*   **Priority:** **P0** (Critical/Blocker) > **P1** (Core Feature) > **P2** (Important) > **P3** (Nice to Have)
*   **Weight:** **S** (Small/Day) < **M** (Medium/Days) < **L** (Large/Week) < **XL** (Extra Large/Weeks)

---

## 🟢 Phase 1: Genesis (The MVP)
**Goal:** Establish the core economy (Membership, SOS, Auto-Karma) and the "First Believer" experience.

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ✅ | **P0** | **M** | **Project Identity** | Define "Don't Code Alone" concept, LP design, and initial Next.js setup. |
| 🔄 | **P0** | **XL** | **Auth System (v5)** | Integrate Auth.js (NextAuth) with GitHub Provider. Secure session management. |
| ⬜ | **P1** | **L** | **Repo Sync Engine** | Fetch user's repositories via Octokit. Design DB schema for efficient syncing. |
| ⬜ | **P1** | **L** | **Membership Logic** | Implement the "Pay 500 Karma to Unlock" transaction model. Prevent Takers. |
| ⬜ | **P1** | **M** | **SOS Beacon UI** | Simple dashboard toggle (`[ON 📡]`). No complex issue management UI. |
| ⬜ | **P2** | **L** | **Gem Radar (Top)** | The discovery engine. Algorithm to display active SOS beacons to Givers. |
| ⬜ | **P2** | **XL** | **GitHub App Bot** | The core automation. Webhook handler for `pull_request.closed` to trigger Karma payouts. |

## 🟡 Phase 2: Engagement (Gamification)
**Goal:** Make contribution addictive. Retention through social proof and visual feedback.

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ⬜ | **P2** | **M** | **Profile 2.0** | "Karma Heatmap" (GitHub style). Visualize contribution streaks. |
| ⬜ | **P3** | **S** | **Kudos System** | Allow Maintainers to attach short "Thank You" messages to Karma transfers. |
| ⬜ | **P3** | **M** | **Leaderboard** | Weekly/Monthly top Givers ranking. "Hero of the Week". |
| ⬜ | **P3** | **L** | **Notification Center** | Real-time alerts for Karma received, Beacon activation, and system updates. |
| ⬜ | **P3** | **M** | **Badges System** | "First Merge", "Bug Hunter", "Sponsor". NFT-like collectibles (maybe). |

## 🔴 Phase 3: Ecosystem (Expansion)
**Goal:** Be everywhere developers live. Terminal, IDE, and Mobile.

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ⬜ | **P3** | **XL** | **GitKarma CLI** | `gk find` to search for issues from the terminal. `gk status` to check Karma. |
| ⬜ | **P4** | **L** | **VS Code Extension** | Sidebar radar. Find help while coding without leaving the editor. |
| ⬜ | **P4** | **XXL** | **Mobile App** | "Tinder for OSS". Swipe right to find a repo to contribute to. Push notifications. |
| ⬜ | **P4** | **XL** | **Enterprise Mode** | Private repository support for internal company karma economies. |

## 🟣 Phase 4: Decentralization (The Future)
**Goal:** Community ownership and sustainability.

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ⬜ | **P5** | **?** | **DAO Governance** | Allow high-karma users to vote on platform features. |
