"use client"

// Form Components Group - Lazy loaded bundle
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
export { Textarea } from './textarea'
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'
export { SelectField } from './select-field'
export { TextareaField } from './textarea-field'
export { InputField, TextareaField as TextareaFieldComponent, SelectField as SelectFieldComponent } from './form-fields'

// Default export for lazy loading
export function FormComponentsGroup({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
}

export default FormComponentsGroup