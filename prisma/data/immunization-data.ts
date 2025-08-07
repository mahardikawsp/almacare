// Master data for Indonesian immunization schedule based on Kemenkes RI and IDAI recommendations
export const IMMUNIZATION_MASTER_DATA = [
    // Imunisasi Dasar Lengkap (IDL) - Wajib
    { ageInMonths: 0, vaccineName: 'HB-0', vaccineType: 'Hepatitis B', isOptional: false, sortOrder: 1, isActive: true, description: 'Hepatitis B dosis pertama, diberikan segera setelah lahir (dalam 24 jam)' },
    { ageInMonths: 1, vaccineName: 'BCG', vaccineType: 'BCG', isOptional: false, sortOrder: 1, isActive: true, description: 'Bacillus Calmette-Guérin untuk mencegah tuberkulosis berat' },
    { ageInMonths: 1, vaccineName: 'Polio 1', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis pertama (OPV atau IPV)' },
    { ageInMonths: 2, vaccineName: 'DPT-HB-Hib 1', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'Difteri, Pertusis, Tetanus, Hepatitis B, Haemophilus influenzae type b dosis pertama' },
    { ageInMonths: 2, vaccineName: 'Polio 2', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis kedua' },
    { ageInMonths: 2, vaccineName: 'Rotavirus 1', vaccineType: 'Rotavirus', isOptional: false, sortOrder: 3, isActive: true, description: 'Rotavirus dosis pertama untuk mencegah diare rotavirus' },
    { ageInMonths: 3, vaccineName: 'DPT-HB-Hib 2', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'DPT-HB-Hib dosis kedua' },
    { ageInMonths: 3, vaccineName: 'Polio 3', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis ketiga' },
    { ageInMonths: 3, vaccineName: 'Rotavirus 2', vaccineType: 'Rotavirus', isOptional: false, sortOrder: 3, isActive: true, description: 'Rotavirus dosis kedua' },
    { ageInMonths: 4, vaccineName: 'DPT-HB-Hib 3', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'DPT-HB-Hib dosis ketiga' },
    { ageInMonths: 4, vaccineName: 'Polio 4', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis keempat' },
    { ageInMonths: 4, vaccineName: 'Rotavirus 3', vaccineType: 'Rotavirus', isOptional: false, sortOrder: 3, isActive: true, description: 'Rotavirus dosis ketiga' },
    { ageInMonths: 9, vaccineName: 'MR 1', vaccineType: 'Campak-Rubella', isOptional: false, sortOrder: 1, isActive: true, description: 'Campak-Rubella dosis pertama' },

    // Imunisasi Lanjutan - Wajib
    { ageInMonths: 18, vaccineName: 'DPT-HB-Hib booster', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'DPT-HB-Hib booster pertama' },
    { ageInMonths: 18, vaccineName: 'MR 2', vaccineType: 'Campak-Rubella', isOptional: false, sortOrder: 2, isActive: true, description: 'Campak-Rubella dosis kedua' },
    { ageInMonths: 18, vaccineName: 'Polio booster', vaccineType: 'Polio', isOptional: false, sortOrder: 3, isActive: true, description: 'Polio booster pertama' },

    // Imunisasi Usia Sekolah - Wajib
    { ageInMonths: 72, vaccineName: 'DT', vaccineType: 'Difteri-Tetanus', isOptional: false, sortOrder: 1, isActive: true, description: 'Difteri-Tetanus untuk anak kelas 1 SD' },
    { ageInMonths: 72, vaccineName: 'MR 3', vaccineType: 'Campak-Rubella', isOptional: false, sortOrder: 2, isActive: true, description: 'Campak-Rubella dosis ketiga untuk kelas 1 SD' },
    { ageInMonths: 144, vaccineName: 'Td', vaccineType: 'Tetanus-Difteri', isOptional: false, sortOrder: 1, isActive: true, description: 'Tetanus-Difteri untuk anak kelas 1 SMP' },

    // Imunisasi Tambahan/Opsional
    { ageInMonths: 6, vaccineName: 'PCV 1', vaccineType: 'Pneumokokus', isOptional: true, sortOrder: 1, isActive: true, description: 'Pneumokokus dosis pertama (opsional)' },
    { ageInMonths: 8, vaccineName: 'PCV 2', vaccineType: 'Pneumokokus', isOptional: true, sortOrder: 1, isActive: true, description: 'Pneumokokus dosis kedua (opsional)' },
    { ageInMonths: 10, vaccineName: 'PCV 3', vaccineType: 'Pneumokokus', isOptional: true, sortOrder: 1, isActive: true, description: 'Pneumokokus dosis ketiga (opsional)' },
    { ageInMonths: 15, vaccineName: 'PCV booster', vaccineType: 'Pneumokokus', isOptional: true, sortOrder: 1, isActive: true, description: 'Pneumokokus booster (opsional)' },

    { ageInMonths: 9, vaccineName: 'JE 1', vaccineType: 'Japanese Encephalitis', isOptional: true, sortOrder: 3, isActive: true, description: 'Japanese Encephalitis dosis pertama (opsional)' },
    { ageInMonths: 24, vaccineName: 'JE 2', vaccineType: 'Japanese Encephalitis', isOptional: true, sortOrder: 1, isActive: true, description: 'Japanese Encephalitis dosis kedua (opsional)' },

    { ageInMonths: 12, vaccineName: 'Varicella 1', vaccineType: 'Varicella', isOptional: true, sortOrder: 1, isActive: true, description: 'Varicella (cacar air) dosis pertama (opsional)' },
    { ageInMonths: 72, vaccineName: 'Varicella 2', vaccineType: 'Varicella', isOptional: true, sortOrder: 3, isActive: true, description: 'Varicella (cacar air) dosis kedua (opsional)' },

    { ageInMonths: 12, vaccineName: 'MMR 1', vaccineType: 'MMR', isOptional: true, sortOrder: 2, isActive: true, description: 'Measles, Mumps, Rubella dosis pertama (alternatif MR)' },
    { ageInMonths: 18, vaccineName: 'MMR 2', vaccineType: 'MMR', isOptional: true, sortOrder: 4, isActive: true, description: 'MMR dosis kedua (alternatif MR)' },

    { ageInMonths: 12, vaccineName: 'Hepatitis A 1', vaccineType: 'Hepatitis A', isOptional: true, sortOrder: 3, isActive: true, description: 'Hepatitis A dosis pertama (opsional)' },
    { ageInMonths: 18, vaccineName: 'Hepatitis A 2', vaccineType: 'Hepatitis A', isOptional: true, sortOrder: 5, isActive: true, description: 'Hepatitis A dosis kedua (opsional)' },

    { ageInMonths: 24, vaccineName: 'Tifoid', vaccineType: 'Tifoid', isOptional: true, sortOrder: 2, isActive: true, description: 'Tifoid untuk anak usia 2 tahun ke atas (opsional)' },

    // Imunisasi Khusus Daerah Endemis
    { ageInMonths: 9, vaccineName: 'Dengue', vaccineType: 'Dengue', isOptional: true, sortOrder: 4, isActive: true, description: 'Dengue untuk daerah endemis (opsional)' },
    { ageInMonths: 15, vaccineName: 'Dengue 2', vaccineType: 'Dengue', isOptional: true, sortOrder: 2, isActive: true, description: 'Dengue dosis kedua (opsional)' },
    { ageInMonths: 21, vaccineName: 'Dengue 3', vaccineType: 'Dengue', isOptional: true, sortOrder: 1, isActive: true, description: 'Dengue dosis ketiga (opsional)' },
]