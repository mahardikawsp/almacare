import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '../table'
import { ResponsiveTable, GrowthTable, ImmunizationTable } from '../responsive-table'

expect.extend(toHaveNoViolations)

// Sample data for testing
const sampleGrowthData = [
    {
        date: '2024-01-15',
        age: '6 bulan',
        weight: 7.2,
        height: 65,
        headCircumference: 42,
        status: 'normal' as const
    },
    {
        date: '2024-02-15',
        age: '7 bulan',
        weight: 7.8,
        height: 67,
        headCircumference: 43,
        status: 'warning' as const
    }
]

const sampleImmunizationData = [
    {
        vaccine: 'BCG',
        scheduledDate: '2023-08-15',
        actualDate: '2023-08-15',
        status: 'completed' as const,
        notes: 'Tidak ada reaksi'
    },
    {
        vaccine: 'DPT 1',
        scheduledDate: '2023-10-15',
        status: 'due' as const
    }
]

describe('Tabs Component', () => {
    it('renders with BayiCare styling', () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        )

        const tabsList = screen.getByRole('tablist')
        const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
        const tab2 = screen.getByRole('tab', { name: 'Tab 2' })

        expect(tabsList).toHaveClass('bg-[#F1F5FC]', 'rounded-xl', 'font-nunito')
        expect(tab1).toHaveClass('font-nunito', 'min-h-[44px]')
        expect(tab2).toHaveClass('font-nunito', 'min-h-[44px]')
    })

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup()

        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
                <TabsContent value="tab3">Content 3</TabsContent>
            </Tabs>
        )

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
        const tab2 = screen.getByRole('tab', { name: 'Tab 2' })

        // Focus first tab
        tab1.focus()
        expect(tab1).toHaveFocus()

        // Navigate to second tab with arrow key
        await user.keyboard('{ArrowRight}')
        expect(tab2).toHaveFocus()

        // Activate tab with Enter
        await user.keyboard('{Enter}')
        expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('has proper accessibility attributes', async () => {
        const { container } = render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        )

        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('has proper touch targets on mobile', () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
            </Tabs>
        )

        const tab = screen.getByRole('tab', { name: 'Tab 1' })
        expect(tab).toHaveClass('min-h-[44px]') // Mobile touch target
    })
})

describe('Accordion Component', () => {
    it('renders with BayiCare styling', () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        )

        const trigger = screen.getByRole('button', { name: /Trigger 1/i })
        const item = trigger.closest('[data-radix-accordion-item]')

        expect(trigger).toHaveClass('font-nunito', 'text-[#163461]', 'min-h-[44px]')
        expect(item).toHaveClass('rounded-xl', 'border-[#EEF3FC]')
    })

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup()

        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item2">
                    <AccordionTrigger>Trigger 2</AccordionTrigger>
                    <AccordionContent>Content 2</AccordionContent>
                </AccordionItem>
            </Accordion>
        )

        const trigger1 = screen.getByRole('button', { name: /Trigger 1/i })
        const trigger2 = screen.getByRole('button', { name: /Trigger 2/i })

        // Focus first trigger
        trigger1.focus()
        expect(trigger1).toHaveFocus()

        // Expand with Space key
        await user.keyboard(' ')
        await waitFor(() => {
            expect(screen.getByText('Content 1')).toBeInTheDocument()
        })

        // Navigate to second trigger with Tab
        await user.keyboard('{Tab}')
        expect(trigger2).toHaveFocus()

        // Expand with Enter key
        await user.keyboard('{Enter}')
        await waitFor(() => {
            expect(screen.getByText('Content 2')).toBeInTheDocument()
        })
    })

    it('has proper accessibility attributes', async () => {
        const { container } = render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        )

        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('shows proper expanded/collapsed states', async () => {
        const user = userEvent.setup()

        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        )

        const trigger = screen.getByRole('button', { name: /Trigger 1/i })

        // Initially collapsed
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument()

        // Expand
        await user.click(trigger)
        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-expanded', 'true')
            expect(screen.getByText('Content 1')).toBeInTheDocument()
        })
    })
})

describe('Table Component', () => {
    it('renders with BayiCare styling', () => {
        render(
            <Table>
                <TableCaption>Test caption</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Header 1</TableHead>
                        <TableHead>Header 2</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell 1</TableCell>
                        <TableCell>Cell 2</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )

        const table = screen.getByRole('table')
        const caption = screen.getByText('Test caption')
        const header = screen.getByRole('columnheader', { name: 'Header 1' })
        const cell = screen.getByRole('cell', { name: 'Cell 1' })

        expect(table).toHaveClass('font-nunito')
        expect(caption).toHaveClass('font-nunito', 'text-[#7C7D7F]')
        expect(header).toHaveClass('font-nunito', 'text-[#163461]')
        expect(cell).toHaveClass('font-nunito', 'text-[#163461]')
    })

    it('has proper table structure and semantics', () => {
        render(
            <Table>
                <TableCaption>Growth data table</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Weight</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>2024-01-15</TableCell>
                        <TableCell>7.2 kg</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )

        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(screen.getByText('Growth data table')).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: 'Weight' })).toBeInTheDocument()
        expect(screen.getByRole('cell', { name: '2024-01-15' })).toBeInTheDocument()
        expect(screen.getByRole('cell', { name: '7.2 kg' })).toBeInTheDocument()
    })

    it('has responsive design classes', () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Header</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )

        const header = screen.getByRole('columnheader')
        const cell = screen.getByRole('cell')

        expect(header).toHaveClass('text-xs', 'sm:text-sm', 'px-3', 'sm:px-4')
        expect(cell).toHaveClass('text-xs', 'sm:text-sm', 'p-3', 'sm:p-4')
    })
})

describe('ResponsiveTable Component', () => {
    const testData = [
        { name: 'John', age: 25, city: 'Jakarta' },
        { name: 'Jane', age: 30, city: 'Bandung' }
    ]

    const testColumns = [
        { key: 'name', label: 'Name' },
        { key: 'age', label: 'Age' },
        { key: 'city', label: 'City' }
    ]

    it('renders desktop table view', () => {
        render(<ResponsiveTable data={testData} columns={testColumns} />)

        // Desktop table should be present
        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
        expect(screen.getByRole('cell', { name: 'John' })).toBeInTheDocument()
    })

    it('shows empty state when no data', () => {
        render(<ResponsiveTable data={[]} columns={testColumns} />)

        expect(screen.getByText('Tidak ada data untuk ditampilkan')).toBeInTheDocument()
    })

    it('supports custom render functions', () => {
        const columnsWithRender = [
            {
                key: 'name',
                label: 'Name',
                render: (value: string) => <strong>{value}</strong>
            },
            { key: 'age', label: 'Age' }
        ]

        render(<ResponsiveTable data={testData} columns={columnsWithRender} />)

        const nameCell = screen.getByRole('cell', { name: 'John' })
        expect(nameCell.querySelector('strong')).toBeInTheDocument()
    })
})

describe('GrowthTable Component', () => {
    it('renders growth data with proper formatting', () => {
        render(<GrowthTable growthData={sampleGrowthData} />)

        expect(screen.getByText('15/01/2024')).toBeInTheDocument() // Indonesian date format
        expect(screen.getByText('7.2 kg')).toBeInTheDocument()
        expect(screen.getByText('65 cm')).toBeInTheDocument()
        expect(screen.getByText('Normal')).toBeInTheDocument()
    })

    it('shows proper status badges', () => {
        render(<GrowthTable growthData={sampleGrowthData} />)

        const normalBadge = screen.getByText('Normal')
        const warningBadge = screen.getByText('Perhatian')

        expect(normalBadge).toHaveClass('text-[#04A3E8]', 'bg-[#04A3E8]/10')
        expect(warningBadge).toHaveClass('text-[#7C7D7F]', 'bg-[#7C7D7F]/10')
    })
})

describe('ImmunizationTable Component', () => {
    it('renders immunization data with proper formatting', () => {
        render(<ImmunizationTable immunizationData={sampleImmunizationData} />)

        expect(screen.getByText('BCG')).toBeInTheDocument()
        expect(screen.getByText('15/08/2023')).toBeInTheDocument() // Indonesian date format
        expect(screen.getByText('Selesai')).toBeInTheDocument()
        expect(screen.getByText('Jatuh Tempo')).toBeInTheDocument()
    })

    it('shows proper status badges for immunizations', () => {
        render(<ImmunizationTable immunizationData={sampleImmunizationData} />)

        const completedBadge = screen.getByText('Selesai')
        const dueBadge = screen.getByText('Jatuh Tempo')

        expect(completedBadge).toHaveClass('text-[#04A3E8]', 'bg-[#04A3E8]/10')
        expect(dueBadge).toHaveClass('text-[#7C7D7F]', 'bg-[#7C7D7F]/10')
    })
})

describe('Accessibility Features', () => {
    it('all components pass accessibility tests', async () => {
        const { container } = render(
            <div>
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                </Tabs>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item1">
                        <AccordionTrigger>Trigger 1</AccordionTrigger>
                        <AccordionContent>Content 1</AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Header</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Cell</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )

        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})