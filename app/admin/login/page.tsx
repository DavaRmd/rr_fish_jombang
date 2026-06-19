'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type View = 'login' | 'forgot' | 'reset-sent'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<View>('login')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!email.trim()) {
      setError('Email wajib diisi.')
      return
    }
    if (!password) {
      setError('Password wajib diisi.')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        // Translate common Supabase errors to Indonesian
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email atau password salah. Silakan periksa kembali.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Email belum dikonfirmasi. Silakan cek inbox email Anda.')
        } else if (authError.message.includes('Too many requests')) {
          setError('Terlalu banyak percobaan login. Silakan tunggu beberapa saat.')
        } else {
          setError(authError.message || 'Login gagal. Periksa email dan password Anda.')
        }
        return
      }

      if (data.user) {
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan koneksi. Silakan periksa internet Anda dan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email wajib diisi untuk reset password.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/admin/login?mode=reset`,
        }
      )

      if (resetError) {
        if (resetError.message.includes('User not found')) {
          setError('Email tidak ditemukan dalam sistem.')
        } else {
          setError(resetError.message || 'Gagal mengirim email reset password.')
        }
        return
      }

      setView('reset-sent')
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RR</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RR Fish Jombang</h1>
          <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Login Admin</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="rrfishjombang@gmail.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-100"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError('') }}
                    className="text-sm text-brand hover:text-brand-dark transition font-medium"
                  >
                    Lupa password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses...
                    </span>
                  ) : 'Login'}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                Hanya admin yang memiliki akun yang dapat mengakses dashboard ini.
              </p>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-sm text-gray-600 mb-6">
                Masukkan email admin Anda. Kami akan mengirim link reset password ke email tersebut.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="rrfishjombang@gmail.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-100"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => { setView('login'); setError('') }}
                  className="text-sm text-brand hover:text-brand-dark transition font-medium"
                >
                  ← Kembali ke Login
                </button>
              </div>
            </>
          )}

          {/* RESET SENT VIEW */}
          {view === 'reset-sent' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Email Terkirim!</h2>
              <p className="text-sm text-gray-600 mb-2">
                Link reset password telah dikirim ke:
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-4 break-all">
                {email}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Silakan cek inbox email Anda (termasuk folder spam) dan klik link untuk reset password.
              </p>
              <button
                onClick={() => { setView('login'); setError('') }}
                className="text-sm text-brand hover:text-brand-dark transition font-medium"
              >
                ← Kembali ke Login
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-brand transition">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
