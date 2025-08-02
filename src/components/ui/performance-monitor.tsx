"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { useMemoryMonitor, usePerformanceMonitor } from './performance-utils'

interface PerformanceMonitorProps {
    enabled?: boolean
    showInProduction?: boolean
}

export function PerformanceMonitor({
    enabled = process.env.NODE_ENV === 'development',
    showInProduction = false
}: PerformanceMonitorProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [performanceMetrics, setPerformanceMetrics] = useState<{
        fps: number
        loadTime: number
        bundleSize: number
    }>({
        fps: 0,
        loadTime: 0,
        bundleSize: 0
    })

    const memoryInfo = useMemoryMonitor()
    const { renderCount } = usePerformanceMonitor('PerformanceMonitor')

    useEffect(() => {
        if (!enabled && !showInProduction) return

        // FPS monitoring
        let frameCount = 0
        let lastTime = performance.now()

        const measureFPS = () => {
            frameCount++
            const currentTime = performance.now()

            if (currentTime - lastTime >= 1000) {
                setPerformanceMetrics(prev => ({
                    ...prev,
                    fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
                }))
                frameCount = 0
                lastTime = currentTime
            }

            requestAnimationFrame(measureFPS)
        }

        requestAnimationFrame(measureFPS)

        // Load time measurement
        if (typeof window !== 'undefined') {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
            setPerformanceMetrics(prev => ({
                ...prev,
                loadTime: loadTime
            }))
        }

        // Bundle size estimation
        const scripts = document.querySelectorAll('script[src*="_next"]')
        setPerformanceMetrics(prev => ({
            ...prev,
            bundleSize: scripts.length
        }))
    }, [enabled, showInProduction])

    if (!enabled && !showInProduction) return null

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-4 right-4 z-50 bg-[#04A3E8] text-white p-2 rounded-full shadow-lg hover:bg-[#163461] transition-colors"
                style={{ fontSize: '12px' }}
            >
                📊
            </button>

            {/* Performance panel */}
            {isVisible && (
                <div className="fixed bottom-16 right-4 z-50 w-80">
                    <Card className="bg-white/95 backdrop-blur-sm border-[#EEF3FC] shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-nunito text-[#163461] flex items-center justify-between">
                                Performance Monitor
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-[#7C7D7F] hover:text-[#163461] text-lg leading-none"
                                >
                                    ×
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            {/* FPS */}
                            <div className="flex justify-between items-center">
                                <span className="text-[#7C7D7F] font-nunito">FPS:</span>
                                <Badge
                                    variant={performanceMetrics.fps >= 50 ? "default" : "destructive"}
                                    className="text-xs"
                                >
                                    {performanceMetrics.fps}
                                </Badge>
                            </div>

                            {/* Load Time */}
                            <div className="flex justify-between items-center">
                                <span className="text-[#7C7D7F] font-nunito">Load Time:</span>
                                <Badge
                                    variant={performanceMetrics.loadTime < 3000 ? "default" : "destructive"}
                                    className="text-xs"
                                >
                                    {(performanceMetrics.loadTime / 1000).toFixed(2)}s
                                </Badge>
                            </div>

                            {/* Bundle Size */}
                            <div className="flex justify-between items-center">
                                <span className="text-[#7C7D7F] font-nunito">JS Chunks:</span>
                                <Badge variant="outline" className="text-xs">
                                    {performanceMetrics.bundleSize}
                                </Badge>
                            </div>

                            {/* Render Count */}
                            <div className="flex justify-between items-center">
                                <span className="text-[#7C7D7F] font-nunito">Renders:</span>
                                <Badge variant="outline" className="text-xs">
                                    {renderCount}
                                </Badge>
                            </div>

                            {/* Memory Usage */}
                            {memoryInfo.usedJSHeapSize && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#7C7D7F] font-nunito">Memory Used:</span>
                                        <Badge variant="outline" className="text-xs">
                                            {(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#7C7D7F] font-nunito">Memory Total:</span>
                                        <Badge variant="outline" className="text-xs">
                                            {(memoryInfo.totalJSHeapSize! / 1024 / 1024).toFixed(1)}MB
                                        </Badge>
                                    </div>
                                </>
                            )}

                            {/* Performance Tips */}
                            <div className="pt-2 border-t border-[#EEF3FC]">
                                <p className="text-[#7C7D7F] font-nunito text-xs mb-2">Tips:</p>
                                <ul className="text-[#7C7D7F] font-nunito text-xs space-y-1">
                                    {performanceMetrics.fps < 50 && (
                                        <li>• Consider reducing animations</li>
                                    )}
                                    {performanceMetrics.loadTime > 3000 && (
                                        <li>• Bundle size may be too large</li>
                                    )}
                                    {renderCount > 10 && (
                                        <li>• Component re-rendering frequently</li>
                                    )}
                                    {memoryInfo.usedJSHeapSize && memoryInfo.usedJSHeapSize > 50 * 1024 * 1024 && (
                                        <li>• High memory usage detected</li>
                                    )}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}

// Performance warning component
export function PerformanceWarning({
    threshold = 100,
    message = "This component may impact performance"
}: {
    threshold?: number
    message?: string
}) {
    const [renderTime, setRenderTime] = useState(0)

    useEffect(() => {
        const start = performance.now()
        return () => {
            const end = performance.now()
            const time = end - start
            setRenderTime(time)

            if (time > threshold) {
                console.warn(`Performance Warning: ${message} (${time.toFixed(2)}ms)`)
            }
        }
    })

    if (renderTime > threshold && process.env.NODE_ENV === 'development') {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                    <span className="text-yellow-600 text-sm font-medium">⚠️ Performance Warning</span>
                </div>
                <p className="text-yellow-700 text-xs mt-1">
                    {message} (Render time: {renderTime.toFixed(2)}ms)
                </p>
            </div>
        )
    }

    return null
}