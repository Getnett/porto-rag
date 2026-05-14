import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('main entrypoint', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.resetModules()
  })

  it('mounts the app into the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>'

    await import('./main')

    expect(await screen.findByText(/rag admin\s+ingestion tool/i)).toBeInTheDocument()
  })
})
