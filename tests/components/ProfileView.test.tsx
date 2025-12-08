import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ProfileView } from '@/components/dashboard/views/ProfileView'
import type { UserProfileData } from '@/components/dashboard/views/ProfileView'

describe('ProfileView', () => {
  it('loads and displays user profile data', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'user_1',
        name: 'Test User',
        username: 'testuser',
        image: null,
        karma: 123,
        _count: {
          transactionsSent: 2,
          transactionsReceived: 3,
        },
      }),
    } as Response)

    render(<ProfileView />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    })

    expect(screen.getAllByText('testuser').length).toBeGreaterThan(0)
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('Karma Activity (GitGivers)')).toBeInTheDocument()
  })

  it('submits updated profile', async () => {
    const initialUserData: UserProfileData = {
      id: 'user_1',
      name: 'Old Name',
      username: 'olduser',
      image: null,
      karma: 10,
      _count: {
        transactionsSent: 0,
        transactionsReceived: 0,
      },
    }

    const updatedUserData: UserProfileData = {
      ...initialUserData,
      name: 'New Name',
    }

    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation((url, options) => {
      if (options?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: async () => updatedUserData,
        } as Response)
      }
      return Promise.resolve({
        ok: true,
        json: async () => initialUserData,
      } as Response)
    })

    render(<ProfileView />)

    const nameInput = await screen.findByDisplayValue('Old Name')
    fireEvent.change(nameInput, { target: { value: 'New Name' } })

    const saveButton = screen.getByRole('button', { name: /save profile/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'New Name', image: '' }),
        })
      )
    })

    // Verify that the UI has been updated with the new name
    expect(screen.getByDisplayValue('New Name')).toBeInTheDocument()
  })
})
