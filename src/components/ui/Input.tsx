import { forwardRef, InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: 'search' | 'none'
    onClear?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, icon = 'none', onClear, value, ...props }, ref) => {
        const hasValue = value && value.toString().length > 0

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon === 'search' && (
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--color-text-muted))]" />
                    )}
                    <input
                        ref={ref}
                        value={value}
                        className={`
              w-full rounded-xl
              bg-[hsl(var(--color-surface))]
              border border-[hsl(var(--color-border))]
              text-[hsl(var(--color-text))]
              placeholder:text-[hsl(var(--color-text-muted))]
              transition-all duration-150
              focus:outline-none focus:border-[hsl(var(--color-primary))]
              focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.2)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon === 'search' ? 'pl-11' : 'px-4'}
              ${hasValue && onClear ? 'pr-10' : 'pr-4'}
              py-3 text-base
              ${error ? 'border-[hsl(var(--color-error))]' : ''}
              ${className}
            `.replace(/\s+/g, ' ').trim()}
                        {...props}
                    />
                    {hasValue && onClear && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                         text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))]
                         hover:bg-[hsl(var(--color-surface-hover))] transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[hsl(var(--color-error))]">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
