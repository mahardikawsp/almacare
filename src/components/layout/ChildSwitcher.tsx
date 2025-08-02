'use client'

import { useState, useRef, useEffect } from 'react'
import { useChildStore } from '@/stores/childStore'
import { ChevronDownIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'

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
        const baseClasses = "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm shadow-sm"

        if (gender === 'MALE') {
            return (
                <div className={`${baseClasses} bg-gradient-to-br from-primary-500 to-primary-600`}>
                    👦
                </div>
            )
        } else {
            return (
                <div className={`${baseClasses} bg-gradient-to-br from-pink-400 to-pink-500`}>
                    👧
                </div>
            )
        }
    }

    if (children.length === 0) {
        return (
            <div className="w-full max-w-xs lg:max-w-sm xl:max-w-md">
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-white border border-neutral-200 rounded-xl shadow-soft hover:shadow-md transition-all duration-200">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm lg:text-base font-medium text-neutral-900 truncate">Belum ada anak</p>
                        <p className="text-xs lg:text-sm text-neutral-500">Tambahkan profil anak</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.location.href = '/children/add'}
                        className="p-2 lg:p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-label="Tambah anak"
                    >
                        <PlusIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-xs lg:max-w-sm xl:max-w-md" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 p-3 lg:p-4 bg-white border border-neutral-200 rounded-xl shadow-soft hover:shadow-md hover:border-neutral-300 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
                {selectedChild ? (
                    <>
                        {getGenderIcon(selectedChild.gender)}
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm lg:text-base font-medium text-neutral-900 truncate">
                                {selectedChild.name}
                            </p>
                            <p className="text-xs lg:text-sm text-neutral-500 truncate">
                                {formatAge(selectedChild.birthDate)}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-neutral-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm lg:text-base font-medium text-neutral-700 truncate">Pilih Anak</p>
                            <p className="text-xs lg:text-sm text-neutral-500">{children.length} anak</p>
                        </div>
                    </>
                )}
                <ChevronDownIcon
                    className={`w-4 h-4 lg:w-5 lg:h-5 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-72 lg:max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="p-1">
                        {/* Child List */}
                        {children.map((child) => (
                            <button
                                key={child.id}
                                type="button"
                                onClick={() => {
                                    setSelectedChild(child)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 p-3 lg:p-4 m-1 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${selectedChild?.id === child.id
                                    ? 'bg-primary-50 border border-primary-200 text-primary-900'
                                    : 'hover:bg-neutral-50 border border-transparent'
                                    }`}
                            >
                                {getGenderIcon(child.gender)}
                                <div className="flex-1 text-left min-w-0">
                                    <p className={`text-sm lg:text-base font-medium truncate ${selectedChild?.id === child.id ? 'text-primary-900' : 'text-neutral-900'
                                        }`}>
                                        {child.name}
                                    </p>
                                    <p className={`text-xs lg:text-sm truncate ${selectedChild?.id === child.id ? 'text-primary-600' : 'text-neutral-500'
                                        }`}>
                                        {formatAge(child.birthDate)} • {child.relationship}
                                    </p>
                                </div>
                                {selectedChild?.id === child.id && (
                                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}

                        {/* Add Child Button */}
                        {children.length < 5 && (
                            <>
                                <div className="border-t border-neutral-100 my-2 mx-2" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false)
                                        window.location.href = '/children/add'
                                    }}
                                    className="w-full flex items-center gap-3 p-3 lg:p-4 m-1 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 group-hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors">
                                        <PlusIcon className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm lg:text-base font-medium text-primary-600 group-hover:text-primary-700">
                                            Tambah Anak
                                        </p>
                                        <p className="text-xs lg:text-sm text-primary-500">
                                            {children.length}/5 anak
                                        </p>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}