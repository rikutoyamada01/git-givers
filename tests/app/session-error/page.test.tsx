import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SessionErrorPage from '@/app/session-error/page'

// Mock Navbar/Footer to avoid complex checks inside them
vi.mock('@/components/Navbar', () => ({
    default: () => <div data-testid="mock-navbar">Navbar</div>
}))

vi.mock('@/components/Footer', () => ({
    default: () => <div data-testid="mock-footer">Footer</div>
}))

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-explicit-any
  default: (props: any) => <img {...props} alt={props.alt} />,
}))

describe('SessionErrorPage', () => {
    it('renders the page layout correctly', () => {
        render(<SessionErrorPage />)
        
        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument()
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
        
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
        expect(screen.getByText(/ERR_ZOMBIE_SESSION_404/)).toBeInTheDocument()
    })

    it('contains navigation links', () => {
        render(<SessionErrorPage />)
        
        const signOutLink = screen.getByRole('link', { name: /Securely Sign Out/i })
        expect(signOutLink).toHaveAttribute('href', '/signout')

        const homeLink = screen.getByRole('link', { name: /Return Home/i })
        expect(homeLink).toHaveAttribute('href', '/')
    })
})
