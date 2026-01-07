import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-150 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `

        const variants = {
            primary: `
        bg-[hsl(var(--color-primary))] text-white
        hover:bg-[hsl(var(--color-primary-hover))]
        focus-visible:ring-[hsl(var(--color-primary))]
      `,
            secondary: `
        bg-[hsl(var(--color-surface-elevated))] text-[hsl(var(--color-text))]
        border border-[hsl(var(--color-border))]
        hover:bg-[hsl(var(--color-surface-hover))] hover:border-[hsl(var(--color-border-hover))]
        focus-visible:ring-[hsl(var(--color-primary))]
      `,
            ghost: `
        bg-transparent text-[hsl(var(--color-text-secondary))]
        hover:bg-[hsl(var(--color-surface-hover))] hover:text-[hsl(var(--color-text))]
        focus-visible:ring-[hsl(var(--color-primary))]
      `,
            danger: `
        bg-[hsl(var(--color-error))] text-white
        hover:bg-[hsl(var(--color-error)/0.9)]
        focus-visible:ring-[hsl(var(--color-error))]
      `,
        }

        const sizes = {
            sm: 'text-sm px-3 py-1.5 gap-1.5',
            md: 'text-sm px-4 py-2 gap-2',
            lg: 'text-base px-6 py-3 gap-2',
        }

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.replace(/\s+/g, ' ').trim()}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
