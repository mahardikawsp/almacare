'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useDashboardData() {
    const { data: session } = useSession()
    const { children, setChildren } = useChildStore()
    const { setGrowthRecords, setLoading, setError } = useGrowthStore()
    const [isInitialized, setIsInitialized] = useState(false)

    // Fetch children data
    const { data: childrenData, error: childrenError, mutate: mutateChildren } = useSWR(
        session ? '/api/children' : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000 // 30 seconds
        }
    )

    // Fetch growth records for all children
    const { data: growthData, error: growthError, mutate: mutateGrowth } = useSWR(
        session && children.length > 0
            ? `/api/growth?childIds=${children.map(c => c.id).join(',')}`
            : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000 // 1 minute
        }
    )

    // Update children store when data changes
    useEffect(() => {
        if (childrenData?.children) {
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
        } else if (childrenError) {
            console.error('Error fetching children:', childrenError)
            setIsInitialized(true)
        }
    }, [childrenData, childrenError, setChildren])

    // Update growth store when data changes
    useEffect(() => {
        setLoading(true)

        if (growthData?.success && growthData.data) {
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
        } else if (growthError) {
            console.error('Error fetching growth records:', growthError)
            setError('Failed to load growth records')
        }

        setLoading(false)
    }, [growthData, growthError, setGrowthRecords, setLoading, setError])

    // Fetch growth records for individual children when children list changes
    useEffect(() => {
        const fetchAllGrowthRecords = async () => {
            if (!session || children.length === 0) return

            setLoading(true)
            try {
                const allRecords: Array<{
                    id: string
                    childId: string
                    date: Date
                    weight: number
                    height: number
                    headCircumference: number
                    weightForAgeZScore: number
                    heightForAgeZScore: number
                    weightForHeightZScore: number
                    headCircumferenceZScore: number
                }> = []

                for (const child of children) {
                    try {
                        const response = await fetch(`/api/growth?childId=${child.id}`)
                        if (response.ok) {
                            const data = await response.json()
                            if (data.success && data.data) {
                                const formattedRecords = data.data.map((record: {
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
                                allRecords.push(...formattedRecords)
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching growth records for child ${child.id}:`, error)
                    }
                }

                setGrowthRecords(allRecords)
                setError(null)
            } catch (error) {
                console.error('Error fetching all growth records:', error)
                setError('Failed to load growth records')
            } finally {
                setLoading(false)
            }
        }

        if (isInitialized && children.length > 0) {
            fetchAllGrowthRecords()
        }
    }, [children, session, isInitialized, setGrowthRecords, setLoading, setError])

    const refreshData = async () => {
        await Promise.all([
            mutateChildren(),
            mutateGrowth()
        ])
    }

    return {
        isLoading: !isInitialized,
        error: childrenError || growthError,
        refreshData,
        hasChildren: children.length > 0
    }
}