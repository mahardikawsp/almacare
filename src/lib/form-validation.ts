import * as z from "zod"

// Indonesian error messages for common validation scenarios
export const indonesianErrorMessages = {
    // Required fields
    required: "Field ini wajib diisi",

    // String validations
    minLength: (min: number) => `Minimal ${min} karakter`,
    maxLength: (max: number) => `Maksimal ${max} karakter`,

    // Email validation
    email: "Format email tidak valid",

    // Number validations
    number: "Harus berupa angka",
    positive: "Harus berupa angka positif",
    min: (min: number) => `Minimal ${min}`,
    max: (max: number) => `Maksimal ${max}`,

    // Date validations
    date: "Format tanggal tidak valid",
    pastDate: "Tanggal harus di masa lalu",
    futureDate: "Tanggal harus di masa depan",

    // Select/Choice validations
    select: "Pilih salah satu opsi",

    // Phone number
    phone: "Format nomor telepon tidak valid",

    // Password
    password: "Password minimal 8 karakter dengan kombinasi huruf dan angka",
    passwordConfirm: "Konfirmasi password tidak cocok",

    // Custom validations for BayiCare
    childName: "Nama anak harus berisi 2-50 karakter",
    childAge: "Umur anak harus antara 0-60 bulan",
    weight: "Berat badan harus antara 1-50 kg",
    height: "Tinggi badan harus antara 30-150 cm",
    bloodType: "Pilih golongan darah yang valid",
}

// Common validation schemas for BayiCare
export const validationSchemas = {
    // Child information
    childName: z
        .string()
        .min(1, indonesianErrorMessages.required)
        .min(2, indonesianErrorMessages.minLength(2))
        .max(50, indonesianErrorMessages.maxLength(50)),

    email: z
        .string()
        .min(1, indonesianErrorMessages.required)
        .email(indonesianErrorMessages.email),

    phone: z
        .string()
        .min(1, indonesianErrorMessages.required)
        .regex(/^(\+62|62|0)[0-9]{9,13}$/, indonesianErrorMessages.phone),

    // Child measurements
    weight: z
        .number({ message: indonesianErrorMessages.number })
        .min(1, indonesianErrorMessages.min(1))
        .max(50, indonesianErrorMessages.max(50)),

    height: z
        .number({ message: indonesianErrorMessages.number })
        .min(30, indonesianErrorMessages.min(30))
        .max(150, indonesianErrorMessages.max(150)),

    age: z
        .number({ message: indonesianErrorMessages.number })
        .min(0, indonesianErrorMessages.min(0))
        .max(60, indonesianErrorMessages.max(60)),

    // Selections
    gender: z
        .string()
        .min(1, indonesianErrorMessages.select),

    bloodType: z
        .string()
        .optional(),

    // Text fields
    notes: z
        .string()
        .max(500, indonesianErrorMessages.maxLength(500))
        .optional(),

    // Date fields
    birthDate: z
        .date({ message: indonesianErrorMessages.date })
        .max(new Date(), indonesianErrorMessages.pastDate),

    measurementDate: z
        .date({ message: indonesianErrorMessages.date })
        .max(new Date(), indonesianErrorMessages.pastDate),
}

// Helper function to create form schemas
export function createChildFormSchema() {
    return z.object({
        name: validationSchemas.childName,
        email: validationSchemas.email,
        gender: validationSchemas.gender,
        birthDate: validationSchemas.birthDate,
        bloodType: validationSchemas.bloodType,
        notes: validationSchemas.notes,
    })
}

export function createGrowthRecordSchema() {
    return z.object({
        weight: validationSchemas.weight,
        height: validationSchemas.height,
        measurementDate: validationSchemas.measurementDate,
        notes: validationSchemas.notes,
    })
}

export function createMPASIRecordSchema() {
    return z.object({
        mealType: z.string().min(1, indonesianErrorMessages.select),
        foodItems: z.string().min(1, indonesianErrorMessages.required),
        portion: z.string().min(1, indonesianErrorMessages.required),
        reaction: validationSchemas.notes,
        date: validationSchemas.measurementDate,
    })
}

// Focus management helper for accessibility
export function focusFirstError(formElement: HTMLFormElement) {
    const firstErrorElement = formElement.querySelector('[aria-invalid="true"]') as HTMLElement
    if (firstErrorElement) {
        firstErrorElement.focus()
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}