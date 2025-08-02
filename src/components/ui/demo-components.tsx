import React from 'react'
import { Button } from './button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Input } from './input'
import { Label } from './label'
import { FormField } from './form-field'
import { Heart, Plus, Mail, Lock } from 'lucide-react'

export function ComponentDemo() {
    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-berkeley-blue">BayiCare shadcn/ui Components Demo</h1>

            {/* Button Demo */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-berkeley-blue">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Heart /></Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Button disabled>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading
                    </Button>
                    <Button>
                        <Heart className="mr-2 h-4 w-4" />
                        With Left Icon
                    </Button>
                    <Button>
                        With Right Icon
                        <Plus className="ml-2 h-4 w-4" />
                    </Button>
                    <Button disabled>Disabled</Button>
                </div>
            </section>

            {/* Card Demo */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-berkeley-blue">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                            <CardDescription>This is a default card with BayiCare styling</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card content goes here with proper spacing and typography.</p>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm">Action</Button>
                        </CardFooter>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Elevated Card</CardTitle>
                            <CardDescription>This card has enhanced shadow and hover effects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Elevated cards are great for important content.</p>
                        </CardContent>
                    </Card>

                    <Card variant="interactive">
                        <CardHeader>
                            <CardTitle>Interactive Card</CardTitle>
                            <CardDescription>This card responds to user interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Click or tap this card to see the interaction effects.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Input Demo */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-berkeley-blue">Inputs & Forms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                showPasswordToggle
                            />
                        </div>

                        <div>
                            <Label htmlFor="error-input">Input with Error</Label>
                            <Input
                                id="error-input"
                                placeholder="This has an error"
                                error="This field is required"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FormField
                            label="Full Name"
                            placeholder="Enter your full name"
                            required
                        />

                        <FormField
                            label="Phone Number"
                            type="tel"
                            placeholder="Enter your phone number"
                            helperText="We'll use this for appointment reminders"
                        />

                        <FormField
                            label="Baby's Birth Date"
                            type="date"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Size Demo */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-berkeley-blue">Responsive Sizes</h2>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                    </div>

                    <div className="space-y-2">
                        <Input size="sm" placeholder="Small input" />
                        <Input size="default" placeholder="Default input (16px for mobile)" />
                        <Input size="lg" placeholder="Large input" />
                    </div>
                </div>
            </section>
        </div>
    )
}