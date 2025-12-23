import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignOutPage from '@/app/signout/page'
import { signOut } from 'next-auth/react'

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}))

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-explicit-any
  default: (props: any) => <img {...props} alt={props.alt} />,
}))

describe('SignOutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the signout page correctly', () => {
        render(<SignOutPage />)
        expect(screen.getByRole('heading', { name: /sign out/i })).toBeInTheDocument()
        expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument()
    })

    it('calls signOut with correct callbackUrl on button click', async () => {
        render(<SignOutPage />)
        
        const button = screen.getByRole('button', { name: /sign out/i })
        fireEvent.click(button)

        await waitFor(() => {
            expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' })
        })
    })

    it('shows loading state when clicking sign out', async () => {
        render(<SignOutPage />)
        
        const button = screen.getByRole('button', { name: /sign out/i })
        fireEvent.click(button)

        expect(screen.getByText('Signing out...')).toBeInTheDocument()
    })
})
