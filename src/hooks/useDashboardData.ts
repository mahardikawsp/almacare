'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useDashboardData() {
    const { data: session, status } = useSession()
    const { children, setChildren } = useChildStore()
    const { setGrowthRecords, setLoading, setError } = useGrowthStore()
    const [isInitialized, setIsInitialized] = useState(false)

    // Only fetch data when session is ready and authenticated
    const shouldFetch = status === 'authenticated' && session?.user?.id

    // Fetch children data with better error handling
    const { data: childrenData, error: childrenError, mutate: mutateChildren } = useSWR(
        shouldFetch ? '/api/children' : null,
        async (url: string) => {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            return response.json()
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
            errorRetryCount: 3,
            errorRetryInterval: 1000,
            timeout: 10000 // 10 second timeout
        }
    )

    // Fetch growth records for all children - simplified approach
    const { data: growthData, error: growthError, mutate: mutateGrowth } = useSWR(
        shouldFetch && children.length > 0
            ? `/api/growth/summary?userId=${session?.user?.id}`
            : null,
        async (url: string) => {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            return response.json()
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
            errorRetryCount: 2,
            errorRetryInterval: 2000,
            timeout: 15000 // 15 second timeout
        }
    )

    // Update children store when data changes
    useEffect(() => {
        if (childrenData?.children) {
            try {
                const formattedChildren = childrenData.children.map((child: {
                    id: string
                    name: string
                    gender: 'MALE' | 'FEMALE'
                    birthDate: string
                    relationship: string
                    userId: string
                }) => ({
                    ...child,
                    birthDate: new Date(child.birthDate)
                }))
                setChildren(formattedChildren)
                setIsInitialized(true)
            } catch (error) {
                console.error('Error formatting children data:', error)
                setIsInitialized(true)
            }
        } else if (childrenError) {
            console.error('Error fetching children:', childrenError)
            setIsInitialized(true)
        } else if (shouldFetch && childrenData && !childrenData.children) {
            // No children found, but request was successful
            setChildren([])
            setIsInitialized(true)
        }
    }, [childrenData, childrenError, setChildren, shouldFetch])

    // Update growth store when data changes - simplified
    useEffect(() => {
        if (growthData?.success && growthData.data) {
            try {
                const formattedRecords = growthData.data.map((record: {
                    id: string
                    childId: string
                    date: string
                    weight: number
                    height: number
                    headCircumference: number
                    weightForAgeZScore: number
                    heightForAgeZScore: number
                    weightForHeightZScore: number
                    headCircumferenceZScore: number
                }) => ({
                    ...record,
                    date: new Date(record.date)
                }))
                setGrowthRecords(formattedRecords)
                setError(null)
            } catch (error) {
                console.error('Error formatting growth data:', error)
                setError('Failed to format growth records')
            }
        } else if (growthError) {
            console.error('Error fetching growth records:', growthError)
            setError('Failed to load growth records')
        }
        setLoading(false)
    }, [growthData, growthError, setGrowthRecords, setLoading, setError])

    const refreshData = async () => {
        try {
            await Promise.all([
                mutateChildren(),
                mutateGrowth()
            ])
        } catch (error) {
            console.error('Error refreshing dashboard data:', error)
        }
    }

    return {
        isLoading: status === 'loading' || !isInitialized,
        error: childrenError || growthError,
        refreshData,
        hasChildren: children.length > 0
    }
}