'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { UserProfile } from '@/components/auth/UserProfile'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-lg border border-orange-200 flex-shrink-0">
                <img
                  src="/icon.png"
                  alt="AlmaCare Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-800">AlmaCare</span>
            </div>

            <div>
              {status === 'loading' ? (
                <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              ) : session ? (
                <UserProfile />
              ) : (
                <GoogleSignInButton className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg">
                  Masuk
                </GoogleSignInButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden bg-white shadow-xl border border-orange-200">
              <img
                src="/icon.png"
                alt="AlmaCare Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              AlmaCare
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              Pantau tumbuh kembang anak Anda dengan mudah berdasarkan standar WHO dan Kemenkes RI
            </p>
          </div>

          {/* Welcome message for authenticated users */}
          {session && (
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 rounded-2xl max-w-md mx-auto shadow-lg">
              <p className="text-gray-800 font-medium text-lg">
                Selamat datang kembali, <span className="font-bold text-orange-600">{session.user?.name}</span>!
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Grafik pertumbuhan">
                    <title>Grafik pertumbuhan</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Pantau Pertumbuhan
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Catat berat, tinggi, dan lingkar kepala anak dengan perhitungan Z-score WHO
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Jadwal imunisasi">
                    <title>Jadwal imunisasi</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Jadwal Imunisasi
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ikuti jadwal imunisasi nasional sesuai standar Kemenkes RI
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Resep MPASI">
                    <title>Resep MPASI</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Resep MPASI
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dapatkan rekomendasi menu MPASI sesuai usia dan kebutuhan gizi anak
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <button
              onClick={handleGetStarted}
              type="button"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-xl px-12 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {session ? 'Buka Dashboard' : 'Mulai Sekarang'}
            </button>
          </div>

          <div className="mt-20 pt-8 border-t border-gray-300">
            <p className="text-base text-gray-600 font-medium">
              Progressive Web App - Dapat diinstall di perangkat Anda
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Berdasarkan standar WHO dan Kementerian Kesehatan RI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}