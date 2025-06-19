'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignInData = z.infer<typeof signInSchema>
type SignUpData = z.infer<typeof signUpSchema>

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })
  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const handleSignIn = async (data: SignInData) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      onClose()
    } catch (error) {
      // Error handled in auth provider
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true)
    try {
      await signUp(data.email, data.password, data.fullName)
      onClose()
    } catch (error) {
      // Error handled in auth provider
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      // Error handled in auth provider
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-semibold">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full btn-secondary mb-4 disabled:opacity-50"
            >
              Sign in with Google
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            {isSignUp ? (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    {...signUpForm.register('fullName')}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    {...signUpForm.register('email')}
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <input
                    {...signUpForm.register('password')}
                    type="password"
                    className="form-input"
                    placeholder="Create a password"
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Confirm Password</label>
                  <input
                    {...signUpForm.register('confirmPassword')}
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <div>
                  <label className="form-label">Email</label>
                  <input
                    {...signInForm.register('email')}
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <input
                    {...signInForm.register('password')}
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                  />
                  {signInForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
