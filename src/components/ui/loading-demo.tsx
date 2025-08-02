"use client"

import * as React from "react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Progress, CircularProgress, LoadingSpinner } from "./progress"
import { Skeleton, SkeletonText, SkeletonCard, SkeletonHealthCard } from "./skeleton"
import {
    ButtonLoading,
    DashboardLoading,
    GrowthChartLoading,
    ImmunizationLoading,
    MPASILoading,
    FormLoading,
    TableLoading
} from "./loading-states"
import {
    FadeTransition,
    SlideTransition,
    ProgressiveLoading,
    SkeletonMorph
} from "./loading-transitions"

/**
 * Demo component showcasing all loading states and transitions
 */
export function LoadingDemo() {
    const [buttonLoading, setButtonLoading] = React.useState(false)
    const [progressValue, setProgressValue] = React.useState(0)
    const [circularValue, setCircularValue] = React.useState(0)
    const [transitionLoading, setTransitionLoading] = React.useState(false)
    const [morphLoading, setMorphLoading] = React.useState(false)
    const [progressiveStages, setProgressiveStages] = React.useState([true, true, true])

    // Simulate progress
    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgressValue((prev) => (prev >= 100 ? 0 : prev + 10))
            setCircularValue((prev) => (prev >= 100 ? 0 : prev + 15))
        }, 500)

        return () => clearInterval(interval)
    }, [])

    // Simulate progressive loading
    React.useEffect(() => {
        const timeouts = [
            setTimeout(() => setProgressiveStages([false, true, true]), 1000),
            setTimeout(() => setProgressiveStages([false, false, true]), 2000),
            setTimeout(() => setProgressiveStages([false, false, false]), 3000),
            setTimeout(() => setProgressiveStages([true, true, true]), 4000)
        ]

        return () => timeouts.forEach(clearTimeout)
    }, [])

    const handleButtonClick = () => {
        setButtonLoading(true)
        setTimeout(() => setButtonLoading(false), 2000)
    }

    const toggleTransition = () => {
        setTransitionLoading(!transitionLoading)
    }

    const toggleMorph = () => {
        setMorphLoading(!morphLoading)
    }

    return (
        <div className="space-y-8 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Loading States & Transitions Demo</h1>
                <p className="text-muted-foreground">
                    Comprehensive showcase of BayiCare loading components with accessibility features
                </p>
            </div>

            {/* Progress Components */}
            <Card>
                <CardHeader>
                    <CardTitle>Progress Components</CardTitle>
                    <CardDescription>
                        Progress bars, circular progress, and loading spinners with BayiCare theming
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Linear Progress</h3>
                        <Progress value={progressValue} showValue label="Upload Progress" />
                        <Progress value={75} variant="success" showValue label="Health Score" />
                        <Progress value={45} variant="warning" showValue label="Immunization Coverage" />
                        <Progress value={25} variant="error" showValue label="Data Sync" />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Circular Progress</h3>
                        <div className="flex items-center gap-6">
                            <CircularProgress value={circularValue} showValue />
                            <CircularProgress value={85} variant="success" showValue size={60} />
                            <CircularProgress value={60} variant="warning" showValue size={50} />
                            <CircularProgress value={30} variant="error" showValue size={40} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Loading Spinners</h3>
                        <div className="flex items-center gap-6">
                            <LoadingSpinner size="sm" />
                            <LoadingSpinner size="default" />
                            <LoadingSpinner size="lg" />
                            <LoadingSpinner variant="muted" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skeleton Components */}
            <Card>
                <CardHeader>
                    <CardTitle>Skeleton Components</CardTitle>
                    <CardDescription>
                        Various skeleton loading states for different content types
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Basic Skeletons</h3>
                            <div className="space-y-3">
                                <Skeleton variant="text" />
                                <Skeleton variant="circular" />
                                <Skeleton variant="rectangular" className="h-20" />
                                <Skeleton variant="card" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Text Skeletons</h3>
                            <SkeletonText lines={1} />
                            <SkeletonText lines={3} />
                            <SkeletonText lines={5} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Card Skeletons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SkeletonCard />
                            <SkeletonCard showAvatar showActions />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Health-Specific Skeletons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SkeletonHealthCard type="growth" />
                            <SkeletonHealthCard type="immunization" />
                            <SkeletonHealthCard type="mpasi" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Button Loading States */}
            <Card>
                <CardHeader>
                    <CardTitle>Button Loading States</CardTitle>
                    <CardDescription>
                        Interactive buttons with loading states and proper accessibility
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button onClick={handleButtonClick} disabled={buttonLoading}>
                            <ButtonLoading loading={buttonLoading} loadingText="Saving...">
                                Save Data
                            </ButtonLoading>
                        </Button>

                        <Button variant="secondary" disabled>
                            <ButtonLoading loading={true} loadingText="Processing...">
                                Process
                            </ButtonLoading>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Loading Transitions */}
            <Card>
                <CardHeader>
                    <CardTitle>Loading Transitions</CardTitle>
                    <CardDescription>
                        Smooth transitions between loading and loaded states
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Button onClick={toggleTransition}>
                                Toggle Transition Demo
                            </Button>
                            <Button onClick={toggleMorph}>
                                Toggle Skeleton Morph
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Fade Transition</h3>
                                <FadeTransition
                                    loading={transitionLoading}
                                    loadingComponent={<SkeletonCard />}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Loaded Content</CardTitle>
                                            <CardDescription>This content fades in smoothly</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>This is the actual content that appears after loading.</p>
                                        </CardContent>
                                    </Card>
                                </FadeTransition>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Slide Transition</h3>
                                <SlideTransition
                                    loading={transitionLoading}
                                    direction="up"
                                    loadingComponent={<SkeletonCard />}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Loaded Content</CardTitle>
                                            <CardDescription>This content slides in from below</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>This content has a smooth slide transition.</p>
                                        </CardContent>
                                    </Card>
                                </SlideTransition>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Skeleton Morph</h3>
                            <SkeletonMorph
                                loading={morphLoading}
                                skeleton={{ width: "100%", height: "100px", className: "rounded-lg" }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <p>This content morphs from a skeleton shape!</p>
                                    </CardContent>
                                </Card>
                            </SkeletonMorph>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Progressive Loading */}
            <Card>
                <CardHeader>
                    <CardTitle>Progressive Loading</CardTitle>
                    <CardDescription>
                        Content that loads in stages for better perceived performance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProgressiveLoading
                        stages={[
                            {
                                loading: progressiveStages[0],
                                loadingComponent: <Skeleton className="h-8 w-48" />,
                                content: <h3 className="text-xl font-semibold">Stage 1: Header Loaded</h3>,
                                label: "Header section"
                            },
                            {
                                loading: progressiveStages[1],
                                loadingComponent: <SkeletonText lines={3} />,
                                content: (
                                    <div className="space-y-2">
                                        <p>Stage 2: Content loaded with multiple paragraphs.</p>
                                        <p>This demonstrates progressive loading where different sections load at different times.</p>
                                        <p>This improves perceived performance and user experience.</p>
                                    </div>
                                ),
                                label: "Content section"
                            },
                            {
                                loading: progressiveStages[2],
                                loadingComponent: <Skeleton className="h-10 w-32" />,
                                content: <Button>Stage 3: Actions Loaded</Button>,
                                label: "Actions section"
                            }
                        ]}
                    />
                </CardContent>
            </Card>

            {/* BayiCare-Specific Loading States */}
            <Card>
                <CardHeader>
                    <CardTitle>BayiCare-Specific Loading States</CardTitle>
                    <CardDescription>
                        Loading states tailored for health data and baby care features
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Dashboard Loading</h3>
                        <div className="border rounded-lg p-4 bg-muted/20">
                            <DashboardLoading />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Growth Chart Loading</h3>
                        <div className="border rounded-lg p-4 bg-muted/20">
                            <GrowthChartLoading />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Immunization Loading</h3>
                        <div className="border rounded-lg p-4 bg-muted/20">
                            <ImmunizationLoading />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">MPASI Loading</h3>
                        <div className="border rounded-lg p-4 bg-muted/20">
                            <MPASILoading />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Form Loading</h3>
                            <div className="border rounded-lg p-4 bg-muted/20">
                                <FormLoading fields={4} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Table Loading</h3>
                            <div className="border rounded-lg p-4 bg-muted/20">
                                <TableLoading rows={3} columns={3} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Accessibility Features */}
            <Card>
                <CardHeader>
                    <CardTitle>Accessibility Features</CardTitle>
                    <CardDescription>
                        All loading components include proper ARIA labels and screen reader support
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Screen Reader Announcements</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>All loading states have proper <code>role=&quot;status&quot;</code> attributes</li>
                            <li>Progress components include <code>aria-valuemin</code>, <code>aria-valuemax</code>, and <code>aria-valuenow</code></li>
                            <li>Loading spinners have <code>aria-live=&quot;polite&quot;</code> for non-intrusive announcements</li>
                            <li>Skeleton components include descriptive <code>aria-label</code> attributes</li>
                            <li>Transitions respect <code>prefers-reduced-motion</code> settings</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                            <strong>Note:</strong> All components are tested with screen readers and follow WCAG 2.1 AA guidelines.
                            Loading states provide clear feedback without being overwhelming to assistive technology users.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}