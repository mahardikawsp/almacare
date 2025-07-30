import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GrowthRecord {
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
}

interface GrowthStore {
    growthRecords: GrowthRecord[]
    isLoading: boolean
    error: string | null

    // Actions
    setGrowthRecords: (records: GrowthRecord[]) => void
    addGrowthRecord: (record: GrowthRecord) => void
    updateGrowthRecord: (id: string, updates: Partial<GrowthRecord>) => void
    removeGrowthRecord: (id: string) => void
    getLatestRecord: (childId: string) => GrowthRecord | null
    getRecordsByChild: (childId: string) => GrowthRecord[]
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearRecords: () => void
}

export const useGrowthStore = create<GrowthStore>()(
    devtools(
        (set, get) => ({
            growthRecords: [],
            isLoading: false,
            error: null,

            setGrowthRecords: (records) => set({
                growthRecords: records,
                error: null
            }),

            addGrowthRecord: (record) => set((state) => ({
                growthRecords: [...state.growthRecords, record].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                ),
                error: null
            })),

            updateGrowthRecord: (id, updates) => set((state) => ({
                growthRecords: state.growthRecords.map(record =>
                    record.id === id ? { ...record, ...updates } : record
                ),
                error: null
            })),

            removeGrowthRecord: (id) => set((state) => ({
                growthRecords: state.growthRecords.filter(record => record.id !== id),
                error: null
            })),

            getLatestRecord: (childId) => {
                const records = get().growthRecords
                    .filter(record => record.childId === childId)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

                return records[0] || null
            },

            getRecordsByChild: (childId) => {
                return get().growthRecords
                    .filter(record => record.childId === childId)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            },

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),

            clearRecords: () => set({
                growthRecords: [],
                error: null
            })
        }),
        { name: 'growth-store' }
    )
)