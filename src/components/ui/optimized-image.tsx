"use client"

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useLazyImage } from './performance-utils'
import { PERFORMANCE_CONFIG } from '@/lib/performance-config'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    placeholder?: string
    quality?: number
    priority?: boolean
    onLoad?: () => void
    onError?: () => void
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className,
    placeholder,
    quality = PERFORMANCE_CONFIG.components.images.quality,
    priority = false,
    onLoad,
    onError
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const { imgRef, imageSrc, isLoaded: lazyLoaded, isError } = useLazyImage(src, placeholder)

    useEffect(() => {
        if (lazyLoaded) {
            setIsLoaded(true)
            onLoad?.()
        }
    }, [lazyLoaded, onLoad])

    useEffect(() => {
        if (isError) {
            setHasError(true)
            onError?.()
        }
    }, [isError, onError])

    // Generate optimized src with quality parameter
    const optimizedSrc = useMemo(() => {
        if (src.startsWith('data:') || src.startsWith('blob:')) {
            return src
        }

        // Add quality parameter for supported formats
        const url = new URL(src, window.location.origin)
        if (quality !== 85) {
            url.searchParams.set('q', quality.toString())
        }
        return url.toString()
    }, [src, quality])

    if (hasError) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-[#F1F5FC] text-[#7C7D7F] text-sm font-nunito",
                    className
                )}
                style={{ width, height }}
            >
                <span>Gambar tidak dapat dimuat</span>
            </div>
        )
    }

    return (
        <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
            {/* Placeholder while loading */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-[#F1F5FC] animate-pulse flex items-center justify-center"
                >
                    {placeholder ? (
                        <img
                            src={placeholder}
                            alt=""
                            className="w-full h-full object-cover opacity-50"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-[#EEF3FC] rounded-full animate-pulse" />
                    )}
                </div>
            )}

            {/* Actual image */}
            <img
                ref={imgRef}
                src={priority ? optimizedSrc : imageSrc}
                alt={alt}
                width={width}
                height={height}
                className={cn(
                    "transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0",
                    "w-full h-full object-cover"
                )}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
            />
        </div>
    )
}

// Avatar component with optimized loading
export function OptimizedAvatar({
    src,
    alt,
    size = 40,
    className,
    fallback
}: {
    src?: string
    alt: string
    size?: number
    className?: string
    fallback?: string
}) {
    const [hasError, setHasError] = useState(false)

    if (!src || hasError) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-[#04A3E8] text-white font-nunito font-medium rounded-full",
                    className
                )}
                style={{ width: size, height: size }}
            >
                {fallback || alt.charAt(0).toUpperCase()}
            </div>
        )
    }

    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            className={cn("rounded-full", className)}
            onError={() => setHasError(true)}
            quality={90} // Higher quality for avatars
        />
    )
}

// Icon component with lazy loading for large icon sets
export function OptimizedIcon({
    name,
    size = 24,
    className,
    color = 'currentColor'
}: {
    name: string
    size?: number
    className?: string
    color?: string
}) {
    const [IconComponent, setIconComponent] = useState<React.ComponentType<{ size?: number; color?: string; className?: string }> | null>(null)

    useEffect(() => {
        // Dynamically import icons to reduce bundle size
        import('lucide-react')
            .then((icons) => {
                const Icon = (icons as Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>>)[name]
                if (Icon) {
                    setIconComponent(() => Icon)
                }
            })
            .catch(() => {
                console.warn(`Icon "${name}" not found`)
            })
    }, [name])

    if (!IconComponent) {
        return (
            <div
                className={cn("animate-pulse bg-[#EEF3FC] rounded", className)}
                style={{ width: size, height: size }}
            />
        )
    }

    return (
        <IconComponent
            size={size}
            color={color}
            className={className}
        />
    )
}