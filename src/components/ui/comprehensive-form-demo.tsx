'use client'

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "./button"
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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./form"

// Indonesian error messages
const indonesianErrorMessages = {
    required: "Field ini wajib diisi",
    email: "Format email tidak valid",
    minLength: (min: number) => `Minimal ${min} karakter`,
    maxLength: (max: number) => `Maksimal ${max} karakter`,
    select: "Pilih salah satu opsi",
}

// Form schema with Indonesian error messages
const formSchema = z.object({
    namaAnak: z
        .string()
        .min(1, indonesianErrorMessages.required)
        .min(2, indonesianErrorMessages.minLength(2))
        .max(50, indonesianErrorMessages.maxLength(50)),

    email: z
        .string()
        .min(1, indonesianErrorMessages.required)
        .email(indonesianErrorMessages.email),

    jenisKelamin: z
        .string()
        .min(1, indonesianErrorMessages.select),

    golonganDarah: z
        .string()
        .optional(),

    catatanKhusus: z
        .string()
        .max(500, indonesianErrorMessages.maxLength(500))
        .optional(),
})

type FormData = z.infer<typeof formSchema>

const genderOptions = [
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" },
]

const bloodTypeOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
]

export function ComprehensiveFormDemo() {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submitResult, setSubmitResult] = React.useState<FormData | null>(null)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaAnak: "",
            email: "",
            jenisKelamin: "",
            golonganDarah: "",
            catatanKhusus: "",
        },
    })

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setSubmitResult(data)
        setIsSubmitting(false)

        // Show success message
        alert("Data berhasil disimpan!")
    }

    const handleReset = () => {
        form.reset()
        setSubmitResult(null)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-berkeley-blue mb-2">
                    Form Komprehensif dengan Validasi
                </h2>
                <p className="text-gray">
                    Demonstrasi integrasi shadcn/ui Form dengan react-hook-form dan pesan error dalam Bahasa Indonesia
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nama Anak Field */}
                    <FormField
                        control={form.control}
                        name="namaAnak"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nama Anak
                                    <span className="text-red-500 ml-1" aria-label="wajib">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Masukkan nama lengkap anak"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Nama lengkap anak sesuai akta kelahiran
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email Orang Tua
                                    <span className="text-red-500 ml-1" aria-label="wajib">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="contoh@email.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Email untuk notifikasi dan laporan kesehatan
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Jenis Kelamin Field */}
                    <FormField
                        control={form.control}
                        name="jenisKelamin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Jenis Kelamin
                                    <span className="text-red-500 ml-1" aria-label="wajib">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {genderOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Jenis kelamin anak untuk perhitungan pertumbuhan
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Golongan Darah Field */}
                    <FormField
                        control={form.control}
                        name="golonganDarah"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Golongan Darah (Opsional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih golongan darah" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {bloodTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Golongan darah anak jika sudah diketahui
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Catatan Khusus Field */}
                    <FormField
                        control={form.control}
                        name="catatanKhusus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Catatan Khusus (Opsional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Masukkan catatan khusus tentang kondisi kesehatan, alergi, atau informasi penting lainnya..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Informasi tambahan yang perlu diketahui tentang anak (maksimal 500 karakter)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Data"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            Reset Form
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Form State Debug Info */}
            <div className="mt-8 p-4 bg-alice-blue rounded-xl">
                <h3 className="font-semibold text-berkeley-blue mb-3">Status Form:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p><strong>Valid:</strong> {form.formState.isValid ? "✅ Ya" : "❌ Tidak"}</p>
                        <p><strong>Dirty:</strong> {form.formState.isDirty ? "✅ Ya" : "❌ Tidak"}</p>
                        <p><strong>Submitting:</strong> {isSubmitting ? "⏳ Ya" : "❌ Tidak"}</p>
                    </div>
                    <div>
                        <p><strong>Errors:</strong> {Object.keys(form.formState.errors).length}</p>
                        <p><strong>Touched Fields:</strong> {Object.keys(form.formState.touchedFields).length}</p>
                    </div>
                </div>
            </div>

            {/* Submit Result */}
            {submitResult && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-3">Data yang Disimpan:</h3>
                    <pre className="text-sm text-green-700 overflow-x-auto">
                        {JSON.stringify(submitResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}