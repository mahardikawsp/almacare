'use client'

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        Aplikasi Offline
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Tidak ada koneksi internet. Beberapa fitur mungkin tidak tersedia.
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                        Yang Masih Bisa Dilakukan:
                    </h2>
                    <ul className="text-left space-y-2 text-neutral-700">
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Melihat data yang sudah tersimpan
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Melihat grafik pertumbuhan
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Membaca resep MPASI favorit
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                    Coba Lagi
                </button>

                <p className="text-sm text-neutral-500 mt-4">
                    Data akan otomatis tersinkronisasi saat koneksi kembali normal.
                </p>
            </div>
        </div>
    )
}