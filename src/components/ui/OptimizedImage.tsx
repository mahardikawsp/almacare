import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
    sizes?: string
    fill?: boolean
    quality?: number
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    placeholder = 'empty',
    blurDataURL,
    sizes,
    fill = false,
    quality = 75,
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const handleLoad = () => {
        setIsLoading(false)
    }

    const handleError = () => {
        setIsLoading(false)
        setHasError(true)
    }

    if (hasError) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
                <span className="text-gray-500 text-sm">Gambar tidak dapat dimuat</span>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                sizes={sizes}
                quality={quality}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
        </div>
    )
}

// Predefined image configurations for common use cases
export function ProfileImage({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="rounded-full"
            quality={80}
            sizes={`${size}px`}
        />
    )
}

export function RecipeImage({ src, alt }: { src: string; alt: string }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={300}
            height={200}
            className="rounded-lg object-cover"
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
    )
}

export function ChartImage({ src, alt }: { src: string; alt: string }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={800}
            height={400}
            className="w-full h-auto"
            quality={90}
            sizes="(max-width: 768px) 100vw, 800px"
            priority
        />
    )
}