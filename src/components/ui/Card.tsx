import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'glass'
    hover?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'default', hover = false, padding = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))]',
            elevated: 'bg-[hsl(var(--color-surface-elevated))] shadow-lg',
            glass: 'glass border border-[hsl(var(--color-border)/0.5)]',
        }

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        }

        const hoverStyles = hover
            ? 'cursor-pointer transition-all duration-200 hover:border-[hsl(var(--color-border-hover))] hover:shadow-md active:scale-[0.99]'
            : ''

        return (
            <div
                ref={ref}
                className={`rounded-xl ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`.trim()}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export { Card }
export type { CardProps }
