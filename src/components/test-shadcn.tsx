'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TestShadcnComponents() {
    return (
        <div className="p-4 space-y-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>BayiCare shadcn/ui Test</CardTitle>
                    <CardDescription>
                        Testing the shadcn/ui integration with BayiCare theme
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="default">Default Button</Button>
                    <Button variant="default">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Link Button</Button>
                    <Button className="w-full">Full Width Button</Button>
                </CardContent>
            </Card>
        </div>
    )
}