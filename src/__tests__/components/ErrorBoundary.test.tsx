import { render, screen, fireEvent, act } from '@testing-library/react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useState } from 'react'

const ThrowError = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Prevent console.error from cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error message when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('allows retry when error occurs', async () => {
    let shouldError = true
    const TestComponent = () => {
      if (shouldError) {
        throw new Error('Test error')
      }
      return <div>Success</div>
    }

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    )

    const retryButton = screen.getByText('Try again')
    
    await act(async () => {
      shouldError = false
      fireEvent.click(retryButton)
    })

    expect(await screen.findByText('Success', {}, { timeout: 1000 })).toBeInTheDocument()
  })
}) 