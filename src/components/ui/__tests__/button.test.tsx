import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '../button'
import { Heart, Plus } from 'lucide-react'

expect.extend(toHaveNoViolations)

describe('Button', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('bg-picton-blue')
    })

    it('renders all variants correctly', () => {
        const variants = ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as const

        variants.forEach(variant => {
            const { unmount } = render(<Button variant={variant}>{variant} button</Button>)
            const button = screen.getByRole('button', { name: new RegExp(`${variant} button`, 'i') })
            expect(button).toBeInTheDocument()
            unmount()
        })
    })

    it('renders all sizes correctly with proper touch targets', () => {
        const sizes = ['default', 'sm', 'lg', 'icon'] as const

        sizes.forEach(size => {
            const { unmount } = render(<Button size={size}>{size} button</Button>)
            const button = screen.getByRole('button', { name: new RegExp(`${size} button`, 'i') })
            expect(button).toBeInTheDocument()

            // Check minimum touch target for mobile accessibility
            if (size === 'default' || size === 'lg' || size === 'icon') {
                expect(button).toHaveClass('min-h-touch')
            }
            unmount()
        })
    })

    it('shows loading state correctly', () => {
        render(<Button loading>Loading button</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(screen.getByTestId('loader-2')).toBeInTheDocument()
    })

    it('renders with left and right icons', () => {
        render(
            <Button
                leftIcon={<Heart data-testid="heart-icon" />}
                rightIcon={<Plus data-testid="plus-icon" />}
            >
                Icon button
            </Button>
        )

        expect(screen.getByTestId('heart-icon')).toBeInTheDocument()
        expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('hides icons when loading', () => {
        render(
            <Button
                loading
                leftIcon={<Heart data-testid="heart-icon" />}
                rightIcon={<Plus data-testid="plus-icon" />}
            >
                Loading with icons
            </Button>
        )

        expect(screen.queryByTestId('heart-icon')).not.toBeInTheDocument()
        expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
        expect(screen.getByTestId('loader-2')).toBeInTheDocument()
    })

    it('handles click events', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Clickable</Button>)

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled button</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('is disabled when loading is true', () => {
        render(<Button loading>Loading button</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>()
        render(<Button ref={ref}>Ref button</Button>)
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('renders as child component when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link button</a>
            </Button>
        )

        const link = screen.getByRole('link')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/test')
    })

    it('has proper BayiCare styling', () => {
        render(<Button>BayiCare button</Button>)
        const button = screen.getByRole('button')

        // Check BayiCare specific classes
        expect(button).toHaveClass('rounded-xl')
        expect(button).toHaveClass('font-semibold')
        expect(button).toHaveClass('font-sans')
        expect(button).toHaveClass('bg-picton-blue')
    })

    it('has proper touch interaction classes', () => {
        render(<Button>Touch button</Button>)
        const button = screen.getByRole('button')

        expect(button).toHaveClass('active:scale-95')
        expect(button).toHaveClass('touch:active:scale-95')
    })

    it('meets accessibility requirements', async () => {
        const { container } = render(<Button>Accessible button</Button>)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('has proper focus styles', () => {
        render(<Button>Focus button</Button>)
        const button = screen.getByRole('button')

        expect(button).toHaveClass('focus-visible:outline-none')
        expect(button).toHaveClass('focus-visible:ring-2')
        expect(button).toHaveClass('focus-visible:ring-ring')
    })

    it('supports keyboard navigation', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Keyboard button</Button>)

        const button = screen.getByRole('button')
        button.focus()

        fireEvent.keyDown(button, { key: 'Enter' })
        expect(handleClick).toHaveBeenCalledTimes(1)

        fireEvent.keyDown(button, { key: ' ' })
        expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('has proper ARIA attributes when loading', () => {
        render(<Button loading>Loading button</Button>)
        const button = screen.getByRole('button')

        expect(button).toHaveAttribute('disabled')
    })

    it('maintains minimum touch target size on mobile', () => {
        render(<Button size="default">Touch target</Button>)
        const button = screen.getByRole('button')

        // Check for minimum 44px touch target
        expect(button).toHaveClass('min-h-touch')
    })

    it('applies hover effects correctly', () => {
        render(<Button>Hover button</Button>)
        const button = screen.getByRole('button')

        expect(button).toHaveClass('hover:bg-picton-blue/90')
        expect(button).toHaveClass('hover:shadow-lg')
        expect(button).toHaveClass('hover:-translate-y-0.5')
    })
})