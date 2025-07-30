'use client'

import { useState, useRef, useEffect } from 'react'
import { useChildStore } from '@/stores/childStore'
import { ChildIcon } from '../icons/ChildIcon'
import { PlusIcon } from '../icons/PlusIcon'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'

export function ChildSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { selectedChild, children, setSelectedChild, setChildren } = useChildStore()

    // Load children data
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await fetch('/api/children')
                if (response.ok) {
                    const data = await response.json()
                    setChildren(data.children)
                }
            } catch (error) {
                console.error('Error fetching children:', error)
            }
        }

        fetchChildren()
    }, [setChildren])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const formatAge = (birthDate: Date) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const diffTime = Math.abs(now.getTime() - birth.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 30) {
            return `${diffDays} hari`
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30)
            return `${months} bulan`
        } else {
            const years = Math.floor(diffDays / 365)
            const remainingMonths = Math.floor((diffDays % 365) / 30)
            return remainingMonths > 0 ? `${years} tahun ${remainingMonths} bulan` : `${years} tahun`
        }
    }

    const getGenderIcon = (gender: 'MALE' | 'FEMALE') => {
        if (gender === 'MALE') {
            return (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-soft">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )
        } else {
            return (
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-soft">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )
        }
    }

    if (children.length === 0) {
        return (
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-100/80 via-purple-50/60 to-blue-100/80 rounded-2xl border border-pink-200/50 shadow-medium">
                <div className="w-10 h-10 bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-2xl flex items-center justify-center">
                    <ChildIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-700">Belum ada anak</p>
                    <p className="text-xs text-neutral-500">Tambahkan profil anak Anda</p>
                </div>
                <button
                    type="button"
                    onClick={() => window.location.href = '/children/add'}
                    className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-medium"
                    aria-label="Tambah anak"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-white/80 via-pink-50/60 to-blue-50/60 backdrop-blur-sm rounded-2xl border border-pink-200/50 hover:border-pink-300/60 hover:from-white/90 hover:via-pink-100/70 hover:to-blue-100/70 transition-all duration-300 hover:shadow-medium group"
            >
                {selectedChild ? (
                    <>
                        {getGenderIcon(selectedChild.gender)}
                        <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
                                {selectedChild.name}
                            </p>
                            <p className="text-xs text-neutral-500 group-hover:text-neutral-600">
                                {formatAge(selectedChild.birthDate)}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-2xl flex items-center justify-center">
                            <ChildIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-neutral-700">Pilih Anak</p>
                            <p className="text-xs text-neutral-500">{children.length} anak terdaftar</p>
                        </div>
                    </>
                )}
                <ChevronDownIcon
                    className={`w-4 h-4 text-neutral-500 transition-all duration-300 group-hover:text-neutral-700 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-white/95 via-pink-50/80 to-blue-50/80 backdrop-blur-lg rounded-2xl shadow-large border border-pink-200/50 py-2 z-50 max-h-64 overflow-y-auto">
                    {/* Child List */}
                    {children.map((child) => (
                        <button
                            key={child.id}
                            type="button"
                            onClick={() => {
                                setSelectedChild(child)
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${selectedChild?.id === child.id
                                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-medium transform scale-[1.02]'
                                : 'hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-blue-50/60 hover:scale-[1.01]'
                                }`}
                        >
                            {getGenderIcon(child.gender)}
                            <div className="flex-1 text-left">
                                <p className={`text-sm font-semibold ${selectedChild?.id === child.id ? 'text-white' : 'text-neutral-800'
                                    }`}>
                                    {child.name}
                                </p>
                                <p className={`text-xs ${selectedChild?.id === child.id ? 'text-white/80' : 'text-neutral-500'
                                    }`}>
                                    {formatAge(child.birthDate)} • {child.relationship}
                                </p>
                            </div>
                            {selectedChild?.id === child.id && (
                                <div className="w-6 h-6 bg-white/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}

                    {/* Add Child Button */}
                    {children.length < 5 && (
                        <>
                            <div className="border-t border-pink-200/50 my-2 mx-4" />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false)
                                    window.location.href = '/children/add'
                                }}
                                className="w-full flex items-center gap-4 px-4 py-3 mx-2 text-pink-600 hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-purple-50/60 rounded-xl transition-all duration-200 hover:scale-[1.01] group"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-200">
                                    <PlusIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-semibold text-pink-600 group-hover:text-pink-700">Tambah Anak</p>
                                    <p className="text-xs text-pink-500 group-hover:text-pink-600">
                                        {children.length}/5 anak terdaftar
                                    </p>
                                </div>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}