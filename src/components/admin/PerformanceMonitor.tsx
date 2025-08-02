'use client'

import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { PerformanceMonitor, usePerformanceMonitor } from '../../lib/performance-monitor'

interface PerformanceData {
    timestamp: string
    server: {
        memory: any
        uptime: number
        nodeVersion: string
        platform: string
        arch: string
    }
    database: {
        connection: any
        connectionPool: any
    }
    environment: {
        nodeEnv: string
        memoryLimit: string
    }
}

export function PerformanceMonitorComponent() {
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
    const [clientMemory, setClientMemory] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const { getMemoryUsage, detectMemoryLeaks } = usePerformanceMonitor('PerformanceMonitor')

    const fetchPerformanceData = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/performance')
            const data = await response.json()
            setPerformanceData(data)

            // Get client-side memory usage
            const memory = getMemoryUsage()
            setClientMemory(memory)

            // Check for memory leaks
            detectMemoryLeaks()
        } catch (error) {
            console.error('Failed to fetch performance data:', error)
        } finally {
            setLoading(false)
        }
    }

    const clearMetrics = async () => {
        try {
            await fetch('/api/performance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'clear-metrics' })
            })
            PerformanceMonitor.clearMetrics()
            alert('Metrics cleared successfully')
        } catch (error) {
            console.error('Failed to clear metrics:', error)
        }
    }

    const forceGarbageCollection = async () => {
        try {
            const response = await fetch('/api/performance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'force-gc' })
            })
            const result = await response.json()
            alert(result.message)
        } catch (error) {
            console.error('Failed to trigger garbage collection:', error)
        }
    }

    useEffect(() => {
        fetchPerformanceData()
        const interval = setInterval(fetchPerformanceData, 30000) // Update every 30 seconds
        return () => clearInterval(interval)
    }, [])

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${minutes}m`
    }

    if (!performanceData) {
        return (
            <Card className="p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Performance Monitor</h2>
                <div className="space-x-2">
                    <Button onClick={fetchPerformanceData} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <Button onClick={clearMetrics} variant="outline">
                        Clear Metrics
                    </Button>
                    <Button onClick={forceGarbageCollection} variant="outline">
                        Force GC
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Server Memory */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Server Memory</h3>
                    {performanceData.server.memory && (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Heap Used:</span>
                                <span>{formatBytes(performanceData.server.memory.heapUsed)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Heap Total:</span>
                                <span>{formatBytes(performanceData.server.memory.heapTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>RSS:</span>
                                <span>{formatBytes(performanceData.server.memory.rss)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Usage:</span>
                                <span className={`font-semibold ${performanceData.server.memory.heapUsedPercentage > 80 ? 'text-red-600' :
                                        performanceData.server.memory.heapUsedPercentage > 60 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                    {performanceData.server.memory.heapUsedPercentage}%
                                </span>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Client Memory */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Client Memory</h3>
                    {clientMemory ? (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Used:</span>
                                <span>{formatBytes(clientMemory.usedJSHeapSize)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span>{formatBytes(clientMemory.totalJSHeapSize)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Limit:</span>
                                <span>{formatBytes(clientMemory.jsHeapSizeLimit)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Usage:</span>
                                <span className={`font-semibold ${clientMemory.usedPercentage > 80 ? 'text-red-600' :
                                        clientMemory.usedPercentage > 60 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                    {clientMemory.usedPercentage}%
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Memory API not available</p>
                    )}
                </Card>

                {/* Database */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Database</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={`font-semibold ${performanceData.database.connection.status === 'connected' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {performanceData.database.connection.status}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Connections:</span>
                            <span>{performanceData.database.connectionPool.total_connections}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Active:</span>
                            <span>{performanceData.database.connectionPool.active_connections}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Idle:</span>
                            <span>{performanceData.database.connectionPool.idle_connections}</span>
                        </div>
                    </div>
                </Card>

                {/* System Info */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">System Info</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Uptime:</span>
                            <span>{formatUptime(performanceData.server.uptime)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Node.js:</span>
                            <span>{performanceData.server.nodeVersion}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform:</span>
                            <span>{performanceData.server.platform}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Environment:</span>
                            <span>{performanceData.environment.nodeEnv}</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Report</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(PerformanceMonitor.getPerformanceReport(), null, 2)}
                </pre>
            </Card>
        </div>
    )
}