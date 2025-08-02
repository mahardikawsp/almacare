"use client"

import { useState, useRef, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface VirtualizedListProps<T> {
    items: T[]
    itemHeight: number
    containerHeight: number
    renderItem: (item: T, index: number) => React.ReactNode
    className?: string
    overscan?: number
    onScroll?: (scrollTop: number) => void
    getItemKey?: (item: T, index: number) => string | number
}

export function VirtualizedList<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    className,
    overscan = 5,
    onScroll,
    getItemKey = (_, index) => index
}: VirtualizedListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0)
    const scrollElementRef = useRef<HTMLDivElement>(null)

    const { visibleItems, totalHeight, offsetY } = useMemo(() => {
        const itemCount = items.length
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
        const endIndex = Math.min(
            itemCount - 1,
            Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
        )

        const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
            item,
            index: startIndex + index,
            key: getItemKey(item, startIndex + index)
        }))

        return {
            visibleItems,
            totalHeight: itemCount * itemHeight,
            offsetY: startIndex * itemHeight
        }
    }, [items, itemHeight, scrollTop, containerHeight, overscan, getItemKey])

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop
        setScrollTop(scrollTop)
        onScroll?.(scrollTop)
    }, [onScroll])

    return (
        <div
            ref={scrollElementRef}
            className={cn("overflow-auto", className)}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map(({ item, index, key }) => (
                        <div key={key} style={{ height: itemHeight }}>
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Specialized virtualized components for BayiCare

interface VirtualizedGrowthListProps {
    growthData: Array<{
        id: string
        date: string
        age: string
        weight: number
        height: number
        headCircumference?: number
        status: 'normal' | 'warning' | 'alert'
    }>
    className?: string
    onItemClick?: (item: VirtualizedGrowthListProps['growthData'][0]) => void
}

export function VirtualizedGrowthList({
    growthData,
    className,
    onItemClick
}: VirtualizedGrowthListProps) {
    const renderGrowthItem = useCallback((item: VirtualizedGrowthListProps['growthData'][0], _index: number) => (
        <div
            className={cn(
                "flex items-center justify-between p-4 border-b border-[#EEF3FC] hover:bg-[#F1F5FC]/50 cursor-pointer transition-colors",
                "min-h-[72px]" // Ensure minimum touch target
            )}
            onClick={() => onItemClick?.(item)}
        >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium font-nunito text-[#163461] text-sm">
                        {new Date(item.date).toLocaleDateString('id-ID')}
                    </span>
                    <span
                        className={cn(
                            "inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium",
                            {
                                'bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20': item.status === 'normal',
                                'bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20': item.status === 'warning',
                                'bg-[#163461]/10 text-[#163461] border border-[#163461]/20': item.status === 'alert',
                            }
                        )}
                    >
                        {item.status === 'normal' ? 'Normal' : item.status === 'warning' ? 'Perhatian' : 'Waspada'}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#7C7D7F] font-nunito">
                    <span>Usia: {item.age}</span>
                    <span>BB: {item.weight} kg</span>
                    <span>TB: {item.height} cm</span>
                    {item.headCircumference && <span>LK: {item.headCircumference} cm</span>}
                </div>
            </div>
        </div>
    ), [onItemClick])

    return (
        <VirtualizedList
            items={growthData}
            itemHeight={72}
            containerHeight={400}
            renderItem={renderGrowthItem}
            className={cn("rounded-xl border border-[#EEF3FC] bg-white shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]", className)}
            getItemKey={(item) => item.id}
        />
    )
}

interface VirtualizedImmunizationListProps {
    immunizationData: Array<{
        id: string
        vaccine: string
        scheduledDate: string
        actualDate?: string
        status: 'completed' | 'due' | 'overdue' | 'upcoming'
        notes?: string
    }>
    className?: string
    onItemClick?: (item: VirtualizedImmunizationListProps['immunizationData'][0]) => void
}

export function VirtualizedImmunizationList({
    immunizationData,
    className,
    onItemClick
}: VirtualizedImmunizationListProps) {
    const renderImmunizationItem = useCallback((item: VirtualizedImmunizationListProps['immunizationData'][0], _index: number) => (
        <div
            className={cn(
                "flex items-center justify-between p-4 border-b border-[#EEF3FC] hover:bg-[#F1F5FC]/50 cursor-pointer transition-colors",
                "min-h-[72px]" // Ensure minimum touch target
            )}
            onClick={() => onItemClick?.(item)}
        >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium font-nunito text-[#163461] text-sm">
                        {item.vaccine}
                    </span>
                    <span
                        className={cn(
                            "inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium",
                            {
                                'bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20': item.status === 'completed',
                                'bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20': item.status === 'due',
                                'bg-[#163461]/10 text-[#163461] border border-[#163461]/20': item.status === 'overdue',
                                'bg-[#F1F5FC] text-[#163461] border border-[#EEF3FC]': item.status === 'upcoming',
                            }
                        )}
                    >
                        {item.status === 'completed' ? 'Selesai' :
                            item.status === 'due' ? 'Jatuh Tempo' :
                                item.status === 'overdue' ? 'Terlambat' : 'Akan Datang'}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#7C7D7F] font-nunito">
                    <span>Jadwal: {new Date(item.scheduledDate).toLocaleDateString('id-ID')}</span>
                    {item.actualDate && (
                        <span>Vaksin: {new Date(item.actualDate).toLocaleDateString('id-ID')}</span>
                    )}
                </div>
                {item.notes && (
                    <p className="text-xs text-[#7C7D7F] font-nunito mt-1 line-clamp-1">
                        {item.notes}
                    </p>
                )}
            </div>
        </div>
    ), [onItemClick])

    return (
        <VirtualizedList
            items={immunizationData}
            itemHeight={72}
            containerHeight={400}
            renderItem={renderImmunizationItem}
            className={cn("rounded-xl border border-[#EEF3FC] bg-white shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]", className)}
            getItemKey={(item) => item.id}
        />
    )
}

// Hook for managing virtualized list state
export function useVirtualizedList<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) {
    const [scrollTop, setScrollTop] = useState(0)

    const visibleRange = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight)
        const endIndex = Math.min(
            items.length - 1,
            Math.ceil((scrollTop + containerHeight) / itemHeight)
        )

        return { startIndex, endIndex }
    }, [scrollTop, itemHeight, containerHeight, items.length])

    const handleScroll = useCallback((scrollTop: number) => {
        setScrollTop(scrollTop)
    }, [])

    return {
        visibleRange,
        handleScroll,
        scrollTop
    }
}