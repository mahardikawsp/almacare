"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, SafeAreaWrapper, MobileNav, type MobileNavItem } from "@/components/ui/layout"

// Mock navigation items for demo
const navItems: MobileNavItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
        )
    },
    {
        href: "/children",
        label: "Anak",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )
    },
    {
        href: "/growth",
        label: "Pertumbuhan",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        badge: 2
    },
    {
        href: "/immunization",
        label: "Imunisasi",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        badge: "!"
    },
    {
        href: "/mpasi",
        label: "MPASI",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
        )
    }
]

export function LayoutDemo() {
    const [containerWidth, setContainerWidth] = React.useState<"sm" | "md" | "lg" | "xl" | "full">("lg")
    const [containerPadding, setContainerPadding] = React.useState<"none" | "sm" | "md" | "lg">("md")
    const [safeAreaEnabled, setSafeAreaEnabled] = React.useState(true)

    return (
        <div className="min-h-screen bg-background">
            {/* Demo Controls */}
            <SafeAreaWrapper insets="top">
                <ResponsiveContainer maxWidth="xl" padding="md">
                    <div className="py-6 space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-berkeley-blue">
                                Layout Components Demo
                            </h1>
                            <p className="text-gray">
                                Demonstrasi komponen layout responsif dengan safe area handling
                            </p>
                        </div>

                        {/* Controls */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Demo Controls</CardTitle>
                                <CardDescription>
                                    Ubah pengaturan untuk melihat perubahan layout
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-berkeley-blue">
                                            Container Width
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {(["sm", "md", "lg", "xl", "full"] as const).map((width) => (
                                                <Button
                                                    key={width}
                                                    variant={containerWidth === width ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setContainerWidth(width)}
                                                >
                                                    {width}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-berkeley-blue">
                                            Container Padding
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {(["none", "sm", "md", "lg"] as const).map((padding) => (
                                                <Button
                                                    key={padding}
                                                    variant={containerPadding === padding ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setContainerPadding(padding)}
                                                >
                                                    {padding}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-berkeley-blue">
                                            Safe Area
                                        </label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={safeAreaEnabled ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSafeAreaEnabled(!safeAreaEnabled)}
                                            >
                                                {safeAreaEnabled ? "Enabled" : "Disabled"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ResponsiveContainer>
            </SafeAreaWrapper>

            {/* Main Content Area */}
            <ResponsiveContainer
                maxWidth={containerWidth}
                padding={containerPadding}
                safeArea={safeAreaEnabled}
            >
                <div className="space-y-6 pb-20"> {/* Extra bottom padding for mobile nav */}

                    {/* ResponsiveContainer Demo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>ResponsiveContainer</CardTitle>
                            <CardDescription>
                                Container responsif dengan breakpoint dan padding yang dapat dikonfigurasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-alice-blue rounded-lg">
                                <p className="text-sm text-berkeley-blue">
                                    <strong>Current Settings:</strong><br />
                                    Max Width: {containerWidth}<br />
                                    Padding: {containerPadding}<br />
                                    Safe Area: {safeAreaEnabled ? "Enabled" : "Disabled"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }, (_, i) => (
                                    <Card key={i} className="p-4">
                                        <h4 className="font-medium text-berkeley-blue mb-2">
                                            Card {i + 1}
                                        </h4>
                                        <p className="text-sm text-gray">
                                            Konten card yang responsif dan menyesuaikan dengan container
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* SafeAreaWrapper Demo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>SafeAreaWrapper</CardTitle>
                            <CardDescription>
                                Wrapper untuk menangani safe area pada device dengan notch
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <SafeAreaWrapper insets="all" className="bg-alice-blue rounded-lg p-4">
                                    <p className="text-sm text-berkeley-blue">
                                        <strong>All Insets:</strong> Safe area padding pada semua sisi
                                    </p>
                                </SafeAreaWrapper>

                                <SafeAreaWrapper insets="horizontal" className="bg-alice-blue rounded-lg p-4">
                                    <p className="text-sm text-berkeley-blue">
                                        <strong>Horizontal Insets:</strong> Safe area padding kiri dan kanan saja
                                    </p>
                                </SafeAreaWrapper>

                                <SafeAreaWrapper insets="vertical" className="bg-alice-blue rounded-lg p-4">
                                    <p className="text-sm text-berkeley-blue">
                                        <strong>Vertical Insets:</strong> Safe area padding atas dan bawah saja
                                    </p>
                                </SafeAreaWrapper>
                            </div>
                        </CardContent>
                    </Card>

                    {/* MobileNav Demo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>MobileNav</CardTitle>
                            <CardDescription>
                                Bottom navigation untuk mobile dengan safe area support
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-alice-blue rounded-lg">
                                <p className="text-sm text-berkeley-blue mb-2">
                                    <strong>Fitur MobileNav:</strong>
                                </p>
                                <ul className="text-sm text-gray space-y-1">
                                    <li>✅ Fixed positioning di bottom</li>
                                    <li>✅ Touch-friendly button size (44px minimum)</li>
                                    <li>✅ Active state indication</li>
                                    <li>✅ Badge support untuk notifikasi</li>
                                    <li>✅ Safe area handling untuk home indicator</li>
                                    <li>✅ Keyboard navigation support</li>
                                    <li>✅ High contrast mode compatible</li>
                                </ul>
                            </div>

                            <div className="p-4 border border-alice-blue rounded-lg">
                                <p className="text-sm text-berkeley-blue mb-2">
                                    <strong>Navigation Items:</strong>
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {navItems.map((item) => (
                                        <div key={item.href} className="flex items-center space-x-2 p-2 bg-alice-blue rounded">
                                            <div className="relative">
                                                {item.icon}
                                                {item.badge && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-berkeley-blue">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Responsive Behavior Demo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Responsive Behavior</CardTitle>
                            <CardDescription>
                                Demonstrasi perilaku responsif pada berbagai ukuran layar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-alice-blue rounded-lg">
                                    <h4 className="font-medium text-berkeley-blue mb-2">Mobile (&lt; 640px)</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• Single column layout</li>
                                        <li>• Bottom navigation visible</li>
                                        <li>• Touch-optimized spacing</li>
                                        <li>• Safe area padding applied</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-alice-blue rounded-lg">
                                    <h4 className="font-medium text-berkeley-blue mb-2">Tablet (640px - 1024px)</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• Multi-column layout</li>
                                        <li>• Increased padding</li>
                                        <li>• Optimized for touch and mouse</li>
                                        <li>• Flexible grid systems</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-alice-blue rounded-lg">
                                    <h4 className="font-medium text-berkeley-blue mb-2">Desktop (&gt; 1024px)</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• Full multi-column layout</li>
                                        <li>• Bottom navigation hidden</li>
                                        <li>• Mouse-optimized interactions</li>
                                        <li>• Maximum content width applied</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Accessibility Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Accessibility Features</CardTitle>
                            <CardDescription>
                                Fitur aksesibilitas yang terintegrasi dalam layout components
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-berkeley-blue">Keyboard Navigation</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• Tab navigation support</li>
                                        <li>• Focus indicators</li>
                                        <li>• Skip links</li>
                                        <li>• Proper focus management</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-berkeley-blue">Screen Reader Support</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• ARIA labels</li>
                                        <li>• Semantic HTML</li>
                                        <li>• Current page indication</li>
                                        <li>• Descriptive text</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-berkeley-blue">Visual Accessibility</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• High contrast support</li>
                                        <li>• Reduced motion support</li>
                                        <li>• Color contrast compliance</li>
                                        <li>• Scalable text</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-berkeley-blue">Touch Accessibility</h4>
                                    <ul className="text-sm text-gray space-y-1">
                                        <li>• 44px minimum touch targets</li>
                                        <li>• Adequate spacing</li>
                                        <li>• Haptic feedback ready</li>
                                        <li>• Gesture support</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ResponsiveContainer>

            {/* Mobile Navigation - Only visible on mobile */}
            <MobileNav items={navItems} />
        </div>
    )
}