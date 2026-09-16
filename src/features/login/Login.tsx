import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

// Predefined user accounts
const USER_ACCOUNTS = {
  'finance@company.com': { password: 'finance@123', role: 'Finance Team' },
  'compliance@company.com': { password: 'compliance@123', role: 'Compliance Team' },
  'admin@gmail.com': { password: 'admin@123', role: 'Administrator' },
}

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate login validation
    setTimeout(() => {
      const userAccount = USER_ACCOUNTS[email as keyof typeof USER_ACCOUNTS]
      
      if (!userAccount) {
        setError('Invalid email address. Please use: finance@company.com, compliance@company.com, or admin@gmail.com')
        setIsLoading(false)
        return
      }

      if (password !== userAccount.password) {
        setError('Incorrect password. Please try again.')
        setIsLoading(false)
        return
      }

      // Successful login
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', userAccount.role)
      localStorage.setItem('userEmail', email)
      navigate('/dashboard')
      setIsLoading(false)
    }, 1000)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotSubmitted(true)
    // In real app, this would send a password reset email
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setForgotEmail('')
    setForgotSubmitted(false)
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-base text-gray-600">Reset your ComplyDesk password</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {!forgotSubmitted ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Send Reset Link
                  <ArrowRight size={20} />
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Back to Login
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                <p className="text-base text-gray-600">
                  We've sent a password reset link to <span className="font-medium">{forgotEmail}</span>
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ComplyDesk</h1>
          <p className="text-lg text-gray-600 mb-1">Vendor & Invoice Compliance</p>
          <p className="text-base text-gray-500">Smarter Compliance Before Payment</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use: finance@company.com, compliance@company.com, or admin@gmail.com
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Need help?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}