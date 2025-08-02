'use client'

import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"

import { Input } from "./input"
import { Textarea } from "./textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./form"

interface BaseFieldProps {
    label: string
    description?: string
    required?: boolean
    className?: string
}

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

// Input Field Component
interface InputFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps {
    control: Control<TFieldValues>
    name: TName
    type?: string
    placeholder?: string
}

export function InputField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    required = false,
    type = "text",
    placeholder,
    className,
}: InputFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1" aria-label="wajib">*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// Textarea Field Component
interface TextareaFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps {
    control: Control<TFieldValues>
    name: TName
    placeholder?: string
    rows?: number
}

export function TextareaField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    required = false,
    placeholder,
    rows = 4,
    className,
}: TextareaFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1" aria-label="wajib">*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            rows={rows}
                            {...field}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// Select Field Component
interface SelectFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps {
    control: Control<TFieldValues>
    name: TName
    placeholder?: string
    options: SelectOption[]
}

export function SelectField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    required = false,
    placeholder,
    options,
    className,
}: SelectFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1" aria-label="wajib">*</span>
                        )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}