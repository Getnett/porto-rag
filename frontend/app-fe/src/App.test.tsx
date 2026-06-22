import { createMemoryHistory } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'
import { createAppRouter } from './router'

describe('App', () => {
  it('renders the overview route inside the admin shell', async () => {
    const router = createAppRouter()
    router.update({
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    render(<App router={router} />)

    expect(await screen.findByRole('heading', { name: /overview/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /coming soon/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument()
  })

  it('renders routed pages from sidebar links', async () => {
    const router = createAppRouter()
    router.update({
      history: createMemoryHistory({ initialEntries: ['/ingestion'] }),
    })

    render(<App router={router} />)

    expect(await screen.findByRole('heading', { name: /ingestion/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ingestion/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('renders the auth page outside the admin shell', async () => {
    const router = createAppRouter()
    router.update({
      history: createMemoryHistory({ initialEntries: ['/auth'] }),
    })

    render(<App router={router} />)

    expect(await screen.findByRole('heading', { name: /prepare, index/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /sign in/i })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.queryByRole('navigation', { name: /primary navigation/i })).not.toBeInTheDocument()
  })
})
