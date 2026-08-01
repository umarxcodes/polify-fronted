import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders with variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-secondary')
  })

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders lucide icon components passed as props', () => {
    render(<Button icon={Plus}>With icon</Button>)
    const button = screen.getByRole('button', { name: /with icon/i })
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })
})

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })
})

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>Badge text</Badge>)
    expect(screen.getByText('Badge text')).toBeInTheDocument()
  })

  it('applies variant class', () => {
    render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toHaveClass('badge-success')
  })
})
