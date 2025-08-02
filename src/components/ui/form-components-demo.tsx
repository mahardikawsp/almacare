'use client'

import * as React from "react"
import { SelectField } from "./select-field"
import { TextareaField } from "./textarea-field"
import { Button } from "./button"

const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
]

const bloodTypeOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
]

export function FormComponentsDemo() {
    const [gender, setGender] = React.useState<string>("")
    const [bloodType, setBloodType] = React.useState<string>("")
    const [notes, setNotes] = React.useState<string>("")
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<string, string> = {}

        if (!gender) {
            newErrors.gender = "Jenis kelamin harus dipilih"
        }

        if (!bloodType) {
            newErrors.bloodType = "Golongan darah harus dipilih"
        }

        if (!notes.trim()) {
            newErrors.notes = "Catatan tidak boleh kosong"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            alert("Form berhasil disubmit!")
            console.log({ gender, bloodType, notes })
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-berkeley-blue">Demo Komponen Form</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <SelectField
                    label="Jenis Kelamin"
                    placeholder="Pilih jenis kelamin"
                    options={genderOptions}
                    value={gender}
                    onValueChange={setGender}
                    error={errors.gender}
                    helperText="Pilih jenis kelamin anak"
                    required
                />

                <SelectField
                    label="Golongan Darah"
                    placeholder="Pilih golongan darah"
                    options={bloodTypeOptions}
                    value={bloodType}
                    onValueChange={setBloodType}
                    error={errors.bloodType}
                    helperText="Golongan darah anak (opsional)"
                />

                <TextareaField
                    label="Catatan Tambahan"
                    placeholder="Masukkan catatan tambahan tentang anak..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    error={errors.notes}
                    helperText="Catatan khusus tentang kondisi atau kebutuhan anak"
                    required
                    rows={4}
                />

                <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                        Simpan Data
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setGender("")
                            setBloodType("")
                            setNotes("")
                            setErrors({})
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </form>

            <div className="mt-8 p-4 bg-alice-blue rounded-xl">
                <h3 className="font-semibold text-berkeley-blue mb-2">Preview Data:</h3>
                <div className="text-sm space-y-1">
                    <p><strong>Jenis Kelamin:</strong> {gender || "Belum dipilih"}</p>
                    <p><strong>Golongan Darah:</strong> {bloodType || "Belum dipilih"}</p>
                    <p><strong>Catatan:</strong> {notes || "Belum diisi"}</p>
                </div>
            </div>
        </div>
    )
}