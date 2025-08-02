'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { UserProfile } from '@/components/auth/UserProfile'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen bg-baby-gradient">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-warm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary-600">AlmaCare</span>
            </div>

            <div>
              {status === 'loading' ? (
                <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              ) : session ? (
                <UserProfile />
              ) : (
                <GoogleSignInButton className="text-sm px-4 py-2">
                  Masuk
                </GoogleSignInButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-600 mb-6">
            AlmaCare
          </h1>
          <p className="text-xl md:text-2xl text-neutral-700 mb-8 max-w-3xl mx-auto font-medium">
            Pantau tumbuh kembang anak Anda dengan mudah berdasarkan standar WHO dan Kemenkes RI
          </p>

          {/* Welcome message for authenticated users */}
          {session && (
            <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-2xl max-w-md mx-auto shadow-soft">
              <p className="text-primary-700 font-medium">
                Selamat datang kembali, <span className="font-semibold">{session.user?.name}</span>!
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Grafik pertumbuhan">
                    <title>Grafik pertumbuhan</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Pantau Pertumbuhan
                </h3>
                <p className="text-neutral-600">
                  Catat berat, tinggi, dan lingkar kepala anak dengan perhitungan Z-score WHO
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Jadwal imunisasi">
                    <title>Jadwal imunisasi</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Jadwal Imunisasi
                </h3>
                <p className="text-neutral-600">
                  Ikuti jadwal imunisasi nasional sesuai standar Kemenkes RI
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Resep MPASI">
                    <title>Resep MPASI</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Resep MPASI
                </h3>
                <p className="text-neutral-600">
                  Dapatkan rekomendasi menu MPASI sesuai usia dan kebutuhan gizi anak
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button
              onClick={handleGetStarted}
              type="button"
              variant="default"
              size="lg"
              className="text-lg px-8 py-4 rounded-2xl font-semibold shadow-warm hover:shadow-soft-lg transition-all duration-300"
            >
              {session ? 'Buka Dashboard' : 'Mulai Sekarang'}
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              Progressive Web App - Dapat diinstall di perangkat Anda
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              Berdasarkan standar WHO dan Kementerian Kesehatan RI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}