interface ChevronDownIconProps {
    className?: string
}

export function ChevronDownIcon({ className = "w-6 h-6" }: ChevronDownIconProps) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Chevron down icon"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    )
}