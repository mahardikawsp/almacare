'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Child {
    id: string
    name: string
    birthDate: Date
}

interface UpcomingEventsProps {
    child?: Child
}

interface Event {
    id: string
    title: string
    description: string
    date: Date
    type: 'immunization' | 'checkup' | 'milestone' | 'activity'
    icon: string
    color: string
    bgColor: string
    daysUntil: number
}

export function UpcomingEvents({ child }: UpcomingEventsProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            if (!child) {
                setEvents([])
                setIsLoading(false)
                return
            }

            try {
                // Mock events data - in real app, this would come from API
                const now = new Date()
                const mockEvents: Event[] = [
                    {
                        id: '1',
                        title: 'Live Q&A: Baby sleep patterns',
                        description: 'Join our expert session',
                        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                        type: 'activity',
                        icon: '💤',
                        color: 'blue',
                        bgColor: 'bg-blue-50',
                        daysUntil: 2
                    },
                    {
                        id: '2',
                        title: 'DPT-HB-Hib 2',
                        description: 'Scheduled immunization',
                        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                        type: 'immunization',
                        icon: '💉',
                        color: 'green',
                        bgColor: 'bg-green-50',
                        daysUntil: 5
                    },
                    {
                        id: '3',
                        title: 'Growth Check',
                        description: 'Monthly measurement',
                        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                        type: 'checkup',
                        icon: '📏',
                        color: 'purple',
                        bgColor: 'bg-purple-50',
                        daysUntil: 7
                    },
                    {
                        id: '4',
                        title: 'First Smile Milestone',
                        description: 'Expected development',
                        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                        type: 'milestone',
                        icon: '😊',
                        color: 'yellow',
                        bgColor: 'bg-yellow-50',
                        daysUntil: 10
                    }
                ]

                setEvents(mockEvents.sort((a, b) => a.daysUntil - b.daysUntil))
            } catch (error) {
                console.error('Error fetching events:', error)
                setEvents([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [child])

    const formatDaysUntil = (days: number) => {
        if (days === 0) return 'Today'
        if (days === 1) return 'Tomorrow'
        if (days <= 7) return `${days} days`
        if (days <= 30) return `${Math.ceil(days / 7)} weeks`
        return `${Math.ceil(days / 30)} months`
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'immunization':
                return 'text-green-600 bg-green-100'
            case 'checkup':
                return 'text-purple-600 bg-purple-100'
            case 'milestone':
                return 'text-yellow-600 bg-yellow-100'
            case 'activity':
                return 'text-blue-600 bg-blue-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">
                        {events.length}
                    </span>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">📅</span>
                    </div>
                    <p className="text-sm text-gray-600">No upcoming events</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {events.slice(0, 4).map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            {/* Event Icon */}
                            <div className={`w-10 h-10 ${event.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <span className="text-lg">{event.icon}</span>
                            </div>

                            {/* Event Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                            {event.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {event.description}
                                        </p>
                                    </div>

                                    {/* Days Until */}
                                    <div className="flex-shrink-0">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(event.type)}`}>
                                            {formatDaysUntil(event.daysUntil)}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar for urgent events */}
                                {event.daysUntil <= 3 && (
                                    <div className="mt-2">
                                        <div className="bg-red-100 rounded-full h-1">
                                            <div
                                                className="bg-red-400 h-1 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.max(20, 100 - (event.daysUntil * 30))}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* View All Button */}
            {events.length > 4 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        View all {events.length} events
                    </button>
                </div>
            )}

            {/* Quick Add Event */}
            <div className="mt-4 pt-3 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Event
                </button>
            </div>
        </div>
    )
}