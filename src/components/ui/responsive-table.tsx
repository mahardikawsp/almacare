"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { VirtualizedList } from "./virtualized-list"
import { PERFORMANCE_CONFIG } from "@/lib/performance-config"

interface ResponsiveTableProps {
    data: Array<Record<string, unknown>>
    columns: Array<{
        key: string
        label: string
        className?: string
        render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
    }>
    className?: string
    mobileCardView?: boolean
    enableVirtualization?: boolean
    virtualizeThreshold?: number
}

export function ResponsiveTable({
    data,
    columns,
    className,
    mobileCardView = true,
    enableVirtualization = true,
    virtualizeThreshold = PERFORMANCE_CONFIG.components.table.virtualizeAfter
}: ResponsiveTableProps) {
    const shouldVirtualize = useMemo(() =>
        enableVirtualization && data.length > virtualizeThreshold,
        [enableVirtualization, data.length, virtualizeThreshold]
    )

    const renderTableRow = useMemo(() => {
        const TableRowComponent = (row: Record<string, unknown>, index: number) => (
            <TableRow key={index}>
                {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                    </TableCell>
                ))}
            </TableRow>
        )
        TableRowComponent.displayName = 'TableRowComponent'
        return TableRowComponent
    }, [columns])

    const renderMobileCard = useMemo(() => {
        const MobileCardComponent = (row: Record<string, unknown>, index: number) => (
            <div
                key={index}
                className="bg-white rounded-xl border border-[#EEF3FC] p-4 shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]"
            >
                {columns.map((column) => (
                    <div key={column.key} className="flex justify-between items-start py-2 first:pt-0 last:pb-0">
                        <span className="font-medium font-nunito text-[#7C7D7F] text-sm min-w-[100px]">
                            {column.label}:
                        </span>
                        <span className="font-nunito text-[#163461] text-sm text-right flex-1 ml-2">
                            {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                        </span>
                    </div>
                ))}
            </div>
        )
        MobileCardComponent.displayName = 'MobileCardComponent'
        return MobileCardComponent
    }, [columns])
    if (shouldVirtualize) {
        return (
            <div className={cn("w-full", className)}>
                {/* Desktop Virtualized Table View */}
                <div className={cn("hidden sm:block", !mobileCardView && "block")}>
                    <div className="rounded-xl border border-[#EEF3FC] bg-white shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]">
                        <div className="bg-[#F1F5FC] border-b border-[#EEF3FC]">
                            <div className="flex">
                                {columns.map((column) => (
                                    <div key={column.key} className={cn("h-12 px-3 sm:px-4 flex items-center font-semibold font-nunito text-[#163461] text-xs sm:text-sm", column.className)}>
                                        {column.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <VirtualizedList
                            items={data}
                            itemHeight={PERFORMANCE_CONFIG.virtualization.itemHeight}
                            containerHeight={PERFORMANCE_CONFIG.virtualization.containerHeight}
                            renderItem={renderTableRow}
                            getItemKey={(_, index) => index}
                        />
                    </div>
                </div>

                {/* Mobile Virtualized Card View */}
                {mobileCardView && (
                    <div className="sm:hidden">
                        <VirtualizedList
                            items={data}
                            itemHeight={120} // Larger height for mobile cards
                            containerHeight={PERFORMANCE_CONFIG.virtualization.containerHeight}
                            renderItem={renderMobileCard}
                            getItemKey={(_, index) => index}
                            className="space-y-3"
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={cn("w-full", className)}>
            {/* Desktop Table View */}
            <div className={cn("hidden sm:block", !mobileCardView && "block")}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key} className={column.className}>
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(renderTableRow)}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            {mobileCardView && (
                <div className="sm:hidden space-y-3">
                    {data.map(renderMobileCard)}
                </div>
            )}

            {/* Empty state handling */}
            {data.length === 0 && (
                <div className="text-center py-8 text-[#7C7D7F] font-nunito">
                    <p>Tidak ada data untuk ditampilkan</p>
                </div>
            )}
        </div>
    )
}

// Health-specific table components for BayiCare
interface GrowthTableProps {
    growthData: Array<{
        date: string
        age: string
        weight: number
        height: number
        headCircumference?: number
        status: 'normal' | 'warning' | 'alert'
    }>
    className?: string
}

export function GrowthTable({ growthData, className }: GrowthTableProps) {
    const columns = [
        {
            key: 'date',
            label: 'Tanggal',
            render: (value: unknown) => (
                <span className="font-medium">{new Date(value as string).toLocaleDateString('id-ID')}</span>
            )
        },
        {
            key: 'age',
            label: 'Usia',
            className: 'hidden sm:table-cell'
        },
        {
            key: 'weight',
            label: 'Berat (kg)',
            render: (value: unknown) => `${value as number} kg`
        },
        {
            key: 'height',
            label: 'Tinggi (cm)',
            render: (value: unknown) => `${value as number} cm`
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: unknown) => (
                <span
                    className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium",
                        {
                            'bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20': value === 'normal',
                            'bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20': value === 'warning',
                            'bg-[#163461]/10 text-[#163461] border border-[#163461]/20': value === 'alert',
                        }
                    )}
                >
                    {value === 'normal' ? 'Normal' : value === 'warning' ? 'Perhatian' : 'Waspada'}
                </span>
            )
        }
    ]

    return (
        <ResponsiveTable
            data={growthData}
            columns={columns}
            className={className}
        />
    )
}

interface ImmunizationTableProps {
    immunizationData: Array<{
        vaccine: string
        scheduledDate: string
        actualDate?: string
        status: 'completed' | 'due' | 'overdue' | 'upcoming'
        notes?: string
    }>
    className?: string
}

export function ImmunizationTable({ immunizationData, className }: ImmunizationTableProps) {
    const columns = [
        {
            key: 'vaccine',
            label: 'Vaksin',
            render: (value: unknown) => (
                <span className="font-medium text-[#163461]">{value as string}</span>
            )
        },
        {
            key: 'scheduledDate',
            label: 'Jadwal',
            render: (value: unknown) => (
                <span className="text-sm">{new Date(value as string).toLocaleDateString('id-ID')}</span>
            )
        },
        {
            key: 'actualDate',
            label: 'Tanggal Vaksin',
            className: 'hidden md:table-cell',
            render: (value: unknown) =>
                value ? new Date(value as string).toLocaleDateString('id-ID') : '-'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: unknown) => (
                <span
                    className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium",
                        {
                            'bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20': value === 'completed',
                            'bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20': value === 'due',
                            'bg-[#163461]/10 text-[#163461] border border-[#163461]/20': value === 'overdue',
                            'bg-[#F1F5FC] text-[#163461] border border-[#EEF3FC]': value === 'upcoming',
                        }
                    )}
                >
                    {value === 'completed' ? 'Selesai' :
                        value === 'due' ? 'Jatuh Tempo' :
                            value === 'overdue' ? 'Terlambat' : 'Akan Datang'}
                </span>
            )
        }
    ]

    return (
        <ResponsiveTable
            data={immunizationData}
            columns={columns}
            className={className}
        />
    )
}