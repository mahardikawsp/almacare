"use client"

// Data Display Components Group - Lazy loaded bundle
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table'
export { ResponsiveTable, GrowthTable, ImmunizationTable } from './responsive-table'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
export { Badge } from './badge'

// Default export for lazy loading
export function DataDisplayGroup({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
}

export default DataDisplayGroup