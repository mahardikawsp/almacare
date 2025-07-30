import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Child {
    id: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: Date
    relationship: string
    userId: string
}

interface ChildStore {
    selectedChild: Child | null
    children: Child[]
    setSelectedChild: (child: Child) => void
    addChild: (child: Child) => void
    updateChild: (id: string, updates: Partial<Child>) => void
    removeChild: (id: string) => void
    setChildren: (children: Child[]) => void
}

export const useChildStore = create<ChildStore>()(
    devtools(
        (set) => ({
            selectedChild: null,
            children: [],

            setSelectedChild: (child) => set({ selectedChild: child }),

            addChild: (child) => set((state) => ({
                children: [...state.children, child],
                selectedChild: state.selectedChild || child
            })),

            updateChild: (id, updates) => set((state) => ({
                children: state.children.map(child =>
                    child.id === id ? { ...child, ...updates } : child
                ),
                selectedChild: state.selectedChild?.id === id
                    ? { ...state.selectedChild, ...updates }
                    : state.selectedChild
            })),

            removeChild: (id) => set((state) => {
                const newChildren = state.children.filter(child => child.id !== id)
                return {
                    children: newChildren,
                    selectedChild: state.selectedChild?.id === id
                        ? newChildren[0] || null
                        : state.selectedChild
                }
            }),

            setChildren: (children) => set((state) => ({
                children,
                selectedChild: state.selectedChild || children[0] || null
            }))
        }),
        { name: 'child-store' }
    )
)